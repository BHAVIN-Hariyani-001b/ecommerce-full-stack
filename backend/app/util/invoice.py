from flask import current_app
from app.models.invoices import Invoice
from app.db import db
from xhtml2pdf import pisa
from sqlalchemy import select
import os
from dotenv import load_dotenv
from app.db import db
from app.models.users import User
from app.models.UserAddress import UserAddress
load_dotenv()


def build_invoice_html(order, items, invoice_number):
    user = order.user
    address = order.address  # UserAddress via Orders.address relationship

    address_lines = []
    if address:
        if address.userfullname:
            address_lines.append(address.userfullname)
        if address.street_area:
            address_lines.append(address.street_area)
        city_state = ", ".join(filter(None, [address.city, address.state]))
        if city_state:
            address_lines.append(city_state)
        if address.pin_code:
            address_lines.append(f"PIN: {address.pin_code}")

    address_html = "<br/>".join(address_lines) if address_lines else "N/A"

    rows = ""
    for idx, item in enumerate(items, start=1):
        line_total = item.qty * item.price_at_purchase
        rows += f"""
        <tr>
            <td style="padding:12px 10px; border-bottom:1px solid #eeeeee; color:#aaaaaa; font-size:10px; vertical-align:top;">{idx:02d}</td>
            <td style="padding:12px 10px; border-bottom:1px solid #eeeeee; color:#1a1a1a; vertical-align:top;">
                <div style="font-weight:bold;">{item.product.name}</div>
                <div style="color:#999999; font-size:9px; margin-top:2px;">Unit price Rs. {item.price_at_purchase}</div>
            </td>
            <td style="padding:12px 10px; border-bottom:1px solid #eeeeee; text-align:center; color:#555555; vertical-align:top;">{item.qty}</td>
            <td style="padding:12px 10px; border-bottom:1px solid #eeeeee; text-align:right; font-weight:bold; color:#1a1a1a; vertical-align:top;">Rs. {line_total}</td>
        </tr>
        """

    payment = order.payment
    payment_method = getattr(payment, "method", None)
    payment_method_display = payment_method.value.upper() if hasattr(payment_method, "value") else (payment_method or "N/A")
    payment_id = getattr(payment, "razorpay_payment_id", None) or "N/A"
    paid_at = getattr(payment, "paid_at", None)
    paid_at_display = paid_at.strftime("%d %b %Y, %I:%M %p") if paid_at else "N/A"

    # Subtotal derived from actual line items so it always matches what's shown above
    subtotal = sum(float(item.qty * item.price_at_purchase) for item in items)
    tax = round(subtotal * 0.0, 2)  # set actual tax rate here, e.g. 0.18 for 18% GST
    grand_total = subtotal + tax

    ACCENT = "#5b3df0"
    INK = "#1a1a1a"
    MUTED = "#999999"
    BODY = "#555555"
    BORDER = "#eeeeee"

    return f"""
    <html>
    <head>
    <style>
        @page {{
            size: A4;
            margin: 2cm 2.2cm;
        }}
        body {{
            font-family: Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: {BODY};
            margin: 0;
        }}
        .label {{
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: {MUTED};
            padding-bottom: 4px;
        }}
        .value {{
            font-size: 12px;
            font-weight: bold;
            color: {INK};
        }}
        .brand {{
            font-size: 23px;
            font-weight: bold;
            color: {INK};
            letter-spacing: 1px;
        }}
        .brand-accent {{ color: {ACCENT}; }}
        .brand-tag {{
            font-size: 8.5px;
            color: {MUTED};
            letter-spacing: 1.8px;
            text-transform: uppercase;
            margin-top: 3px;
        }}
        .doc-type {{
            font-size: 11px;
            letter-spacing: 3px;
            color: {MUTED};
            text-align: right;
            text-transform: uppercase;
        }}
        .doc-number {{
            font-size: 19px;
            font-weight: bold;
            color: {INK};
            text-align: right;
            margin-top: 3px;
        }}
        .status-pill {{
            display: inline-block;
            color: #ffffff;
            background-color: {ACCENT};
            padding: 5px 16px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }}
        .rule-heavy {{ border-top: 2px solid {INK}; margin: 16px 0 24px 0; }}
        .rule-light {{ border-top: 1px solid {BORDER}; margin: 20px 0; }}
        .info-card {{
            background-color: #fafafa;
            padding: 14px 16px;
        }}
        table.items-table {{
            width: 100%;
            border-collapse: collapse;
        }}
        table.items-table th {{
            border-bottom: 2px solid {INK};
            padding: 0 10px 8px 10px;
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: {INK};
            text-align: left;
        }}
        table.items-table th.center {{ text-align: center; }}
        table.items-table th.right {{ text-align: right; }}
        .summary-card {{
            background-color: #fafafa;
            padding: 18px 20px;
            width: 300px;
            margin-left: auto;
            margin-top: 16px;
        }}
        .summary-card table {{ width: 100%; }}
        .summary-card td {{
            padding: 5px 0;
            font-size: 11px;
            color: {BODY};
        }}
        .summary-total-row td {{
            border-top: 1px solid #dddddd;
            font-size: 17px;
            font-weight: bold;
            color: {ACCENT};
            padding-top: 12px;
        }}

        .payment-strip {{
            border: 1px solid {BORDER};
            padding: 14px 16px;
            margin-top: 32px;
        }}

        .footer {{
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid {BORDER};
            font-size: 8.5px;
            color: {MUTED};
            text-align: center;
            line-height: 1.7;
        }}
        .footer strong {{ color: {INK}; }}
    </style>
    </head>
    <body>

        <table width="100%">
            <tr>
                <td width="50%" style="vertical-align:top;">
                    <div class="brand">VENTURE<span class="brand-accent">.</span></div>
                    <div class="brand-tag">Create Something Amazing</div>
                </td>
                <td width="50%" style="vertical-align:top;">
                    <div class="doc-type">Tax Invoice</div>
                    <div class="doc-number">{invoice_number}</div>
                    <div style="text-align:right; margin-top:8px;">
                        <span class="status-pill">Paid</span>
                    </div>
                </td>
            </tr>
        </table>

        <div class="rule-heavy"></div>

        <table width="100%">
            <tr>
                <td width="33%" style="vertical-align:top;">
                    <div class="label">From</div>
                    <div class="value">Venture Pvt. Ltd.</div>
                    <div style="margin-top:4px; color:{BODY}; line-height:1.5;">
                        Surat, Gujarat, India<br/>
                        support@venture.com<br/>
                        GSTIN: 24XXXXXXXXX1Z5
                    </div>
                </td>
                <td width="33%" style="vertical-align:top;">
                    <div class="label">Bill To</div>
                    <div class="value">{user.username if user else 'N/A'}</div>
                    <div style="margin-top:4px; color:{BODY}; line-height:1.5;">
                        {user.email if user else ''}<br/>
                        {getattr(user, 'phone', '') or ''}
                    </div>
                </td>
                <td width="34%" style="vertical-align:top;">
                    <div class="label">Ship To</div>
                    <div style="margin-top:4px; color:{BODY}; line-height:1.5;">
                        {address_html}
                    </div>
                </td>
            </tr>
        </table>

        <div class="rule-light"></div>

        <table class="info-card" width="100%">
            <tr>
                <td width="25%">
                    <div class="label">Invoice Date</div>
                    <div class="value">{order.create_at.strftime('%d %b %Y') if order.create_at else ''}</div>
                </td>
                <td width="25%">
                    <div class="label">Order Reference</div>
                    <div class="value">#ORD-{order.id[:8].upper()}</div>
                </td>
                <td width="25%">
                    <div class="label">Payment Status</div>
                    <div class="value" style="color:{ACCENT};">Completed</div>
                </td>
                <td width="25%">
                    <div class="label">Items</div>
                    <div class="value">{len(items)}</div>
                </td>
            </tr>
        </table>

        <table class="items-table" style="margin-top:26px;">
            <tr>
                <th width="6%">#</th>
                <th width="52%">Item</th>
                <th width="14%" class="center">Qty</th>
                <th width="28%" class="right">Amount</th>
            </tr>
            {rows}
        </table>

        <table class="summary-card">
            <tr>
                <td>Subtotal</td>
                <td style="text-align:right;">Rs. {subtotal:.2f}</td>
            </tr>
            <tr>
                <td>Tax</td>
                <td style="text-align:right;">Rs. {tax:.2f}</td>
            </tr>
            <tr class="summary-total-row">
                <td>Total Paid</td>
                <td style="text-align:right;">Rs. {grand_total:.2f}</td>
            </tr>
        </table>

        <table class="payment-strip" width="100%">
            <tr>
                <td width="33%">
                    <div class="label">Payment Method</div>
                    <div class="value">{payment_method_display}</div>
                </td>
                <td width="33%">
                    <div class="label">Transaction ID</div>
                    <div class="value">{payment_id}</div>
                </td>
                <td width="34%">
                    <div class="label">Paid On</div>
                    <div class="value">{paid_at_display}</div>
                </td>
            </tr>
        </table>

        <div class="footer">
            <strong>VENTURE</strong> &nbsp;&middot;&nbsp; Create Something Amazing<br/>
            support@venture.com &nbsp;&middot;&nbsp; www.venture.com<br/>
            This is a system-generated invoice and does not require a signature.
        </div>

    </body>
    </html>
    """

def generate_invoice(order):
    existing = db.session.scalar(select(Invoice).where(Invoice.order_id == order.id))
    if existing:
        return existing

    invoice_number = f"INV-{order.id[:8].upper()}"
    html = build_invoice_html(order, order.order_item, invoice_number)

    filename = f"{invoice_number}.pdf"
    invoice_dir = current_app.config["INVOICE_DIR"]
    os.makedirs(invoice_dir, exist_ok=True)
    pdf_path = os.path.join(invoice_dir, filename)

    with open(pdf_path, "wb") as f:
        pisa_status = pisa.CreatePDF(html, dest=f)

    if pisa_status.err:
        raise Exception("PDF generation failed")

    invoice = Invoice(
        order_id=order.id,
        invoice_number=invoice_number,
        pdf_path=pdf_path,
        file_url=f"/static/invoices/{filename}",
    )
    db.session.add(invoice)
    db.session.commit()
    return invoice