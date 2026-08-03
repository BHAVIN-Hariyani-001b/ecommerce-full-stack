import { IoMdAddCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import AddAtribute from "./AddAtribute";
import {
  memo,
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";

const PRIMARY_IMAGE_NAME = "img1";

const galleryImageName = (index) => `img${index + 2}`;

const renumberGallery = (items) =>
  items.map((item, index) => ({ ...item, name: galleryImageName(index) }));

const GalleryUploadSlot = memo(function GalleryUploadSlot({ onAdd }) {
  const galleryInputRef = useRef(null);
  const openGalleryPicker = useCallback(() => {
    galleryInputRef.current?.click();
  }, []);

  return (
    <div className="flex justify-center items-center border border-dashed border-gray-200 w-30 h-30 rounded-xl">
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        className="hidden"
        onChange={onAdd}
        required={true}
      />
      <button
        type="button"
        onClick={openGalleryPicker}
        className="flex flex-col cursor-pointer gap-2 items-center justify-center py-4 text-green-600"
      >
        <IoMdAddCircleOutline size={30} />
        <p className="text-sm">Add Image</p>
      </button>
    </div>
  );
});

const GalleryImage = memo(function GalleryImage({ img, onRemove }) {
  return (
    <div className="border border-dashed border-gray-200 w-30 rounded-xl relative">
      <img
        src={img?.url ?? img?.image_url}
        alt={img?.name}
        className="w-30 h-30 object-contain rounded-lg"
      />
      <button
        type="button"
        onClick={() => onRemove(img.name)}
        className="absolute top-1 right-1 cursor-pointer"
        aria-label={`Remove ${img.name}`}
      >
        <RxCrossCircled className="text-2xl text-black" />
      </button>
    </div>
  );
});

const AddImage = memo(function AddImage({
  productData,
  setProductData,
  imageRef,
  atributeRef,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState([]);
  const [primPreview, setPrimPreview] = useState(null);
  const fileStorageRef = useRef({ primary: null, gallery: [] });

  // In AddImage.jsx — fix getFormData to use keys Flask expects
  useImperativeHandle(
    imageRef,
    () => ({
      getFormData: () => {
        const formData = new FormData();

        if (fileStorageRef.current.primary) {
          formData.append("image", fileStorageRef.current.primary);
        }

        fileStorageRef.current.gallery.forEach((file) => {
          formData.append("images", file); // same key repeated = list in Flask
        });

        return formData;
      },
      reset: () => {
        setPreview([]);
        setPrimPreview(null);
        fileStorageRef.current = { primary: null, gallery: [] };
      },
    }),
    [],
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const imageURL = URL.createObjectURL(file);
      fileStorageRef.current.primary = file;

      setPrimPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { name: PRIMARY_IMAGE_NAME, url: imageURL };
      });

      setProductData((prev) => ({
        ...prev,
        image: {
          image_url: imageURL,
          image_name: file?.name,
          is_primary: true,
          sort_order: 1,
        },
      }));
      e.target.value = "";
    },
    [setProductData],
  );

  const handleGalleryAdd = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const imageURL = URL.createObjectURL(file);

      setPreview((prev) => [
        ...prev,
        { name: galleryImageName(prev.length), url: imageURL, imageId: null },
      ]);

      fileStorageRef.current.gallery.push(file);

      setProductData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { image_url: imageURL, image_name: file?.name },
        ],
      }));

      e.target.value = "";
    },
    [setProductData],
  );

  const removeImage = useCallback(
    (name) => {
      if (name === PRIMARY_IMAGE_NAME) {
        fileStorageRef.current.primary = null;
        setPrimPreview((prev) => {
          if (prev?.url) URL.revokeObjectURL(prev.url);
          return null;
        });
        setProductData((prev) => ({ ...prev, image: null }));
        return;
      }

      setPreview((prev) => {
        const target = prev.find((item) => item.name === name);
        if (!target) return prev;

        if (target.imageId) {
          if (target.imageId) {
            setProductData((pd) => ({
              ...pd,
              removeImg: [
                ...new Set([...(pd.removeImg ?? []), target.imageId]),
              ],
            }));
          }
        } else {
          const galleryIndex = prev.findIndex((item) => item.name === name);
          if (galleryIndex !== -1) {
            fileStorageRef.current.gallery.splice(galleryIndex, 1);
          }
        }

        // revoke blob URL only for new uploads
        if (target.url) URL.revokeObjectURL(target.url);

        const filtered = prev.filter((item) => item.name !== name);
        return renumberGallery(filtered);
      });
    },
    [setProductData],
  );

  const handleRemovePrimary = useCallback(
    () => removeImage(PRIMARY_IMAGE_NAME),
    [removeImage],
  );

  useEffect(() => {
    setPreview(
      productData?.images?.map((img, i) => ({
        name: galleryImageName(i),
        image_url: img.image_url,
        imageId: img.id ?? null,
      })) ?? [],
    );
    setPrimPreview(null); // let productData.image.image_url take over
    fileStorageRef.current = { primary: null, gallery: [] };
  }, [productData?.id]);

  return (
    <div className="border border-gray-200 p-3 rounded-xl">
      <div className="p-3 space-y-2">
        <h1 className="text-xl font-semibold py-4">Upload Product Image</h1>
        <p className="px-1 font-semibold">Primary Image</p>
        <div className="border border-dashed border-gray-200 p-3 rounded-xl">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            name="PRIMG"
            id="PrimaryImg"
            required={true}
            onChange={handleFileChange}
          />
          {(primPreview ?? productData?.image?.image_url) ? (
            <div className="w-full p-2 relative">
              <img
                src={primPreview?.url ?? productData?.image?.image_url}
                alt={primPreview?.name ?? productData?.image?.image_name}
                className="w-full h-50 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemovePrimary}
                className="absolute top-3 right-3 cursor-pointer"
                aria-label={`Remove ${primPreview?.name || "primary image"}`}
              >
                <RxCrossCircled className="text-2xl text-black" />
              </button>
              <div className="flex justify-center w-full py-4">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="bg-green-700 w-30 h-12 rounded font-semibold text-white cursor-pointer"
                >
                  Replace
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              id="PrimImg"
              className="flex w-full flex-col cursor-pointer gap-2 items-center justify-center py-4 text-green-600"
            >
              <IoMdAddCircleOutline size={30} />
              <p>Add Image</p>
            </button>
          )}
        </div>

        <p className="px-3 py-3 font-semibold">Gallery</p>
        <div className="grid grid-cols-4 space-y-4 max-[1200px]:grid-cols-3 max-[900px]:flex max-[900px]:flex-wrap max-[900px]:gap-4 max-[900px]:justify-center place-items-center">
          {preview.map((img) => (
            <GalleryImage key={img.name} img={img} onRemove={removeImage} />
          ))}
          <GalleryUploadSlot onAdd={handleGalleryAdd} />
        </div>
      </div>
      <div>
        <AddAtribute
          setProductData={setProductData}
          productData={productData}
          ref={atributeRef}
        />
      </div>
    </div>
  );
});

export default AddImage;
