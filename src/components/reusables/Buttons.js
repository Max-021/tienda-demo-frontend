import React from 'react'

const Buttons = ({btnArray, btnDivClass = 'btnList', btnClass = 'btnUnit'}) => {
  return (
    <div className={btnDivClass}>
        {btnArray.map((btn, index) => {
            return (<>
            <button className={btnClass} key={index} type={'button'} onClick={btn.action} title={btn.name}>
              {btn.name}
            </button>
            {/* separador desactivado temporalmente */}
            {/* <div className='btnSeparator'></div> */}
            </>)
        })}
    </div>
  )
}

export default Buttons