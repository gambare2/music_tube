import { Divider, Link, List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import { AboutUs, TermsOfService, PrivacyPolicy } from '../data'

function Contact() {
  return (
    <div>
      <div className='flex flex-col justify-between gap-4'>
        <h1 className='text-3xl md:text-4xl md:my-6 text-slate-400 font-bold font8 flex justify-center items-center'>Contact Us</h1>

        <Divider variant='middle' />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-left md:items-left gap-10 md:gap-20 mx-5 md:mx-10 my-8">
        {/* About Us */}
        <div className="flex-1">
          <h2 className="font1 text-xl text-slate-700 mb-4">About Us</h2>
          <List disablePadding>
            {AboutUs.map((item, index) => (
              <ListItem
                key={index}
                disableGutters
                disablePadding
                className="flex flex-col items-start px-0"
              >
                <div className="w-full">
                  <p className="text-sm text-slate-600 text-left">{item.title}</p>
                  <p className="text-sm font-semibold text-black underline text-left">
                    {item.subtitle}
                  </p>
                </div>
              </ListItem>
            ))}
          </List>
        </div>



        {/* Terms of Service */}
        <div className="flex-1">
          <h2 className="font1 text-xl text-slate-700 mb-4">Terms of Service</h2>
          <List>
            {TermsOfService.map((item, index) => (
              <ListItem
                key={index}
                className="px-0"
                disablePadding
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ className: 'text-sm text-slate-600' }}
                />
              </ListItem>
            ))}
          </List>
        </div>

        {/* Privacy Policy */}
        <div className="flex-1">
          <h2 className="font1 text-xl text-slate-700 mb-4">Privacy Policy</h2>
          <List>
            {PrivacyPolicy.map((item, index) => (
              <ListItem
                key={index}
                className="px-0"
                disablePadding
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ className: 'text-sm text-slate-600' }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <div className='flex flex-row justify-end  gap-4 md:mx-10 md:my-5'>
        <Link href="/">
          <img src="/icons8-facebook.svg" alt="Music Tube" className='size-5' />
        </Link>
        <Link href="/">
          <img src="/instagram_icon.svg" alt="Music Tube" className='size-5' />
        </Link>
        <Link href="/">
          <img src="/twitter_icons.svg" alt="Music Tube" className='size-5' />
        </Link>
      </div>
      <Divider variant='middle' />
      <span >@2025 PriTube </span>
    </div>
  )
}
export default Contact
