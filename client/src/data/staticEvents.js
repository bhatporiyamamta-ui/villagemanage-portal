/**
 * Purely static, developer-managed village events and gatherings data.
 * All images are statically imported directly from src/assets/Images.
 * NOTE: As per system requirement, admin cannot upload images,
 * and no event data or images are saved to any database.
 * No video uploads are used.
 */

// Ganeshotsav static images from src/assets/Images
import ganeshMandap from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.42 AM.jpeg';
import ganeshIlluminated from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.50 AM (1).jpeg';
import ganeshDarshan from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.50 AM.jpeg';
import ganeshYouthGroup from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (2).jpeg';
import ganeshVisarjanProcession from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (4).jpeg';
import ganeshVisarjanGulal from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (3).jpeg';

// Mataji Mandir & Navratri Festival static images from src/assets/Images
import matajiThrone from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (1).jpeg';
import matajiDarshanCrown from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.52 AM (1).jpeg';
import matajiGreenSaree from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (7).jpeg';
import matajiSinhasanPrasad from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (5).jpeg';
import matajiLotusGarland from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM (6).jpeg';
import matajiPortrait from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.52 AM (4).jpeg';
import matajiFloralMandap from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.51 AM.jpeg';
import matajiFaceCloseup from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.52 AM (2).jpeg';
import matajiLotusShringar from '../assets/Images/WhatsApp Image 2026-10-15 at 10.28.52 AM (3).jpeg';
import matajiIcon from '../assets/Images/icon.jpeg';

export const STATIC_EVENTS = [
  {
    id: 'evt-navratri-2026',
    title: 'Shree Navratri Mahotsav & Ras Garba 2026',
    gujaratiTitle: 'શ્રી નવરાત્રી મહોત્સવ અને ભવ્ય રાસ-ગરબા ૨૦૨૬',
    category: 'Navratri & Garba',
    status: 'Upcoming',
    badge: 'Upcoming Festival',
    date: 'October 20 – October 28, 2026',
    time: '08:30 PM to 01:00 AM Daily',
    venue: 'Panchayat Mandap Grounds, Ichhapore-Bhatha',
    organizer: 'Ichhapore-Bhatha Bhandari Panch Yuvak Mandal',
    coordinator: 'Dineshbhai Bhandari (Up-Pramukh) & Youth Committee',
    image: matajiThrone,
    description: 'The annual 9-night Navratri Mahotsav of Ichhapore-Bhatha Bhandari Panch, celebrated with deep devotion to Mataji. Features traditional Gujarati Garba, live folk orchestra, daily Maha Aarti with 500+ deepaks, and nightly Prasad distribution for all families.',
    highlights: [
      'Daily 08:30 PM Grand Mataji Aarti & Deepotsav',
      'Traditional Garba, Dodhiya & Sanedo with live folk troupe',
      'Prizes for Best Traditional Attire (Children, Youth & Seniors)',
      'Community Maha Prasad arrangements for every household',
      'Dedicated safety, parking & medical volunteers on site'
    ],
    gallery: [
      {
        url: matajiThrone,
        caption: 'Maa Meldi Divya Sinhasan & Floral Canopy'
      },
      {
        url: matajiDarshanCrown,
        caption: 'Sacred Darshan with Golden Mukut & Lotus Malas'
      },
      {
        url: matajiFloralMandap,
        caption: 'Mandir Parishar & Raas-Garba Mandap'
      },
      {
        url: matajiFaceCloseup,
        caption: 'Divine Face Darshan of Mataji with Golden Nath'
      },
      {
        url: matajiLotusGarland,
        caption: 'Sacred Lotus & Rose Shringar on Sinhasan'
      }
    ]
  },
  {
    id: 'evt-ganesh-mahotsav',
    title: 'Shree Ganesh Mahotsav & Visarjan Yatra',
    gujaratiTitle: 'શ્રી ગણેશ મહોત્સવ અને ભવ્ય વિસર્જન યાત્રા',
    category: 'Ganesh Mahotsav',
    status: 'Past',
    badge: 'Community Pride',
    date: 'September 07 – September 17, 2026',
    time: '10 Days Celebration',
    venue: 'Bhandari Panch Yuvak Mandal Mandap & Village Streets',
    organizer: 'Bhandari Panch Yuvak Mandal',
    coordinator: 'Village Youth Committee & Karobari Samiti',
    image: ganeshVisarjanProcession,
    description: 'The joyous 10-day Ganeshotsav celebrated with unmatched enthusiasm across Ichhapore-Bhatha. Features daily evening Aartis, youth gatherings, cultural skits, and a monumental Visarjan Shobhayatra where the whole village comes together in matching traditional kurtas with colors and flower showers.',
    highlights: [
      '10-day celebration organized by Bhandari Panch Yuvak Mandal',
      'Daily Morning & Evening community Aarti with dhol-tasha',
      'Night Shobhayatra with youth group in matching royal blue traditional kurtas',
      'Grand Visarjan procession under green palm arch with gulal and flower showers',
      'Eco-friendly Visarjan with complete community participation'
    ],
    gallery: [
      {
        url: ganeshVisarjanProcession,
        caption: 'Grand Visarjan Procession with Village Youth & Children under Palm Canopy'
      },
      {
        url: ganeshYouthGroup,
        caption: 'Bhandari Panch Yuvak Mandal in Royal Blue Kurtas during Shobhayatra'
      },
      {
        url: ganeshMandap,
        caption: 'Ganpati Bappa Idol in Grand Decorated Mandap'
      },
      {
        url: ganeshDarshan,
        caption: 'Ganpati Bappa Divine Face Darshan with Fresh Garlands'
      },
      {
        url: ganeshIlluminated,
        caption: 'Evening Illumination & Deepotsav Aarti'
      },
      {
        url: ganeshVisarjanGulal,
        caption: 'Ganpati Bappa Smeared with Gulal & Flowers during Visarjan'
      }
    ]
  },
  {
    id: 'evt-mandir-patotsav',
    title: 'Shree Meldi Mataji Temple Annual Patotsav & Maha Prasad',
    gujaratiTitle: 'શ્રી મેલડી માતાજી મંદિર વાર્ષિક પાટોત્સવ અને મહાપ્રસાદ',
    category: 'Mandir Patotsav',
    status: 'Past',
    badge: 'Sacred Milestone',
    date: 'June 03, 2026',
    time: '07:00 AM to 10:00 PM',
    venue: 'Shree Meldi Mataji Mandir Parishar, Ichhapore-Bhatha',
    organizer: 'Mandir Jirnoddhar & Utsav Samiti',
    coordinator: 'Pramukh Rameshbhai Bhandari & Village Elders',
    image: matajiSinhasanPrasad,
    description: 'A deeply pious day marking the annual Patotsav of Shree Meldi Mataji Mandir. More than 1,200 devotees and diaspora members gathered for the sacred Havan, Abhishek, flag offering (Dhwajarohan), and continuous community Maha Prasad.',
    highlights: [
      'Sacred Vedic Havan & Navchandi Yagya ceremony',
      'Grand Dhwajarohan (New temple flag hoisting ceremony)',
      'Continuous Maha Prasad served to 1,200+ villagers & guests',
      'Evening devotional Bhajan Sandhya by noted Gujarati artists',
      'Felicitation of temple trust donors and volunteers'
    ],
    gallery: [
      {
        url: matajiSinhasanPrasad,
        caption: 'Mataji Sinhasan with Sacred Prasad & Yagya Offerings'
      },
      {
        url: matajiGreenSaree,
        caption: 'Mataji Darshan in Green Silk with Trishul on Lion'
      },
      {
        url: matajiPortrait,
        caption: 'Sacred Patotsav Shringar & Lotus Malas'
      },
      {
        url: matajiLotusShringar,
        caption: 'Divya Darshan with Golden Mukut & Jewels'
      },
      {
        url: matajiIcon,
        caption: 'Divine Blessing Face of Mataji'
      }
    ]
  }
];

export const EVENT_CATEGORIES = [
  'All',
  'Navratri & Garba',
  'Ganesh Mahotsav',
  'Mandir Patotsav'
];
