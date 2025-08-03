export const HomeMusics = [
    {
      id: 1,
      title: "Music 1",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 1"
    },
    {
      id: 2,
      title: "Music 2",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 2"
    },
    {
      id: 3,
      title: "Music 3",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 3"
    },
    {
      id: 4,
      title: "Music 4",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 4"
    },
    {
      id: 5,
      title: "Music 5",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 5"
    },
    {
      id: 6,
      title: "Music 6",
      artist: "Artist 1",
      thumbnail: "music_thumbnail.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "This is the description of the music 6"
    }
  ]

  export type AudiusArtist = {
    id: string;
    name: string;
    handle: string;
    location?: string;
    profile_picture: {
      medium: string;
    };
  };
  
  export type AudiusTrack = {
    id: string;
    title: string;
    stream_url: string;
    artwork?: {
      thumbnail: string;
    };
    user: {
      name: string;
    };
  };
  
  
export  const ArtistListData = [
    {
      id: 1,
      name: "Artist 1",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 2,
      name: "Artist 2",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 3,
      name: "Artist 3",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 4,
      name: "Artist 4",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 10,
      name: "Artist 5",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 5,
      name: "Artist 6",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 6,
      name: "Artist 7",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 7,
      name: "Artist 8",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 8,
      name: "Artist 9",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 9,
      name: "Artist 10",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 11,
      name: "Artist 8",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 12,
      name: "Artist 9",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 13,
      name: "Artist 10",
      thumbnail: "Avatar_profile.svg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
  
  ]

  export const AboutUs = [
    {
      title: 'About Us',
      link: '/about'
    },
    {
      title: 'Contact Us',
      link: '/contact'
    },
    {
      title: 'G-1, Utaam Nagar, New Delhi, India',
    },
    {
      title: 'Email: ',
      subtitle: 'info@music-tube.com',
      link: 'mailto:info@music-tube.com'
    },
    {
      title: 'Phone:',
      subtitle: '+91 9876543210',
      link: 'tel:+919876543210'
    }
  
  ]

  export const TermsOfService = [
    {
      title: 'About this terms ',
      link: '/terms-of-service'
    },
    {
      title: 'Use of the Service',
      link: '/terms-of-service'
    },
    {
      title: 'User Accounts',
      link: '/terms-of-service'
    },
    {
      title: 'Content and Copyright',
      link: '/terms-of-service'
    },
    {
      title: 'Disclaimer',
      link: '/terms-of-service'
    },
    {
      title: 'Limitation of Liability',
      link: '/terms-of-service'
    },
  ]
  export const PrivacyPolicy = [
    {
      title: 'Privacy Policy',
      link: '/privacy-policy'
    },
    {
      title: 'Use of Cookies',
      link: '/privacy-policy'
    },
    {
      title: 'Data Security',
      link: '/privacy-policy'
    },
    {
      title: 'Changes to Privacy Policy',
      link: '/privacy-policy'
    },
  
  ]