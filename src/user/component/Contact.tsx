import { Divider, Link, List, ListItem, ListItemText } from '@mui/material';
import { AboutUs, TermsOfService, PrivacyPolicy } from '../data';

function Contact() {
  return (
    <div className="px-4 py-8 md:px-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl text-slate-400 font-bold font8">Contact Us</h1>
        <Divider variant="middle" className="mt-4" />
      </div>

      <div className="flex flex-col md:flex-row gap-10 md:gap-20">
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
                  <p className="text-sm text-slate-600">{item.title}</p>
                  <p className="text-sm font-semibold text-black underline">{item.subtitle}</p>
                </div>
              </ListItem>
            ))}
          </List>
        </div>

        {/* Terms of Service */}
        <div className="flex-1">
          <h2 className="font1 text-xl text-slate-700 mb-4">Terms of Service</h2>
          <List disablePadding>
            {TermsOfService.map((item, index) => (
              <ListItem key={index} disablePadding className="px-0">
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
          <List disablePadding>
            {PrivacyPolicy.map((item, index) => (
              <ListItem key={index} disablePadding className="px-0">
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ className: 'text-sm text-slate-600' }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex justify-center md:justify-end gap-4 mt-10">
        <Link href="/" aria-label="Facebook">
          <img src="/icons8-facebook.svg" alt="Facebook" className="w-5 h-5" />
        </Link>
        <Link href="/" aria-label="Instagram">
          <img src="/instagram_icon.svg" alt="Instagram" className="w-5 h-5" />
        </Link>
        <Link href="/" aria-label="Twitter">
          <img src="/twitter_icons.svg" alt="Twitter" className="w-5 h-5" />
        </Link>
      </div>

      <Divider variant="middle" className="my-6" />

      <p className="text-center text-xs text-slate-500">
        © 2025 <span className="font-semibold">PriTube</span>. All rights reserved.
      </p>
    </div>
  );
}

export default Contact;

