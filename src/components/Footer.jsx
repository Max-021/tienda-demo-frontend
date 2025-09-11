import React from 'react'
import MadeBy from './reusables/MadeBy.jsx'
import Links from './reusables/Links.jsx'

import { footerBtns } from '../data/iconsArray.jsx'

const Footer = () => {
  return (
    <footer>
      <Links linkArray={footerBtns}/>
      <MadeBy/>
    </footer>
  )
}

export default Footer