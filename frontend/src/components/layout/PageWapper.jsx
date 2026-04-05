const PageWapper = ({children}) => {
  return (
    <div className="max-w-280 px-40 max-[1300px]:px-30 max-[900px]:px-20 max-[600px]:px-10">
        {children}
    </div>
  )
}

export default PageWapper
