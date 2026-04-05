const PageWapper = ({children,className}) => {
  return (
    <div className={`max-w-310  ${className}`}>
        {children}
    </div>
  )
}

export default PageWapper
