import React from 'react'
import MadeBy from './reusables/MadeBy'
import Links from './reusables/Links'

import { footerBtns } from '../data/iconsArray'

const Footer = () => {
  return (
    <footer>
      <Links linkArray={footerBtns}/>
      <MadeBy/>
    </footer>
  )
}

export default Footer