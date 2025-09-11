import React, {useState} from 'react'

const Buttons = ({btnArray, btnDivClass = 'btnList', btnClass = 'btnUnit', activeBtnClass = 'btnUnitActive', defActiveVal = null}) => {
  const [activeIndex, setActiveIndex] = useState(defActiveVal);

  const handleClick = (index, action) => {
    setActiveIndex(index);

    if(typeof action === 'function') action();
  }
  return (
    <div className={btnDivClass}>
        {btnArray.map((btn, index) => {
            return (
              <button className={`${btnClass} ${activeIndex === index ? activeBtnClass : ''}`} key={index} type={'button'} onClick={() => handleClick(index, btn.action)} title={btn.name}>
                {btn.name}
              </button>
            )
        })}
    </div>
  )
}

export default Buttons