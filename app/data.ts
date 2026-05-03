export interface Image {
  id: string
  smallImage?: string
  biggerImage?: string
  fullSizeImage?: string
  url?: string
  __typename?: string
}

export interface User {
  id: string
  username: string
  profileImage: Image
  isPremierShop: boolean
}

export interface LivestreamCategory {
  id: string
  label: string
  deeplink: string
  __typename?: string
}

export interface Livestream {
  id: string
  activeViewers: number
  livestreamCategories: LivestreamCategory[]
  startTime: number
  status: string
  tags: string[]
  thumbnail: Image
  trailerUrl: string | null
  title: string
  user: User
}

export const mockLivestreams: Livestream[] = [
  {
    'id': '793d436f-454d-4b8b-9a53-53c66c1879e0',
    'activeViewers': 40,
    'livestreamCategories': [
      {
        'id': 'TGl2ZXN0cmVhbVRhZ05vZGU6OTQw',
        'label': 'Magic: The Gathering',
        'deeplink': 'tag/magic_cards',
        '__typename': 'LivestreamTagNode',
      },
    ],
    'startTime': 1777602428208.0,
    'status': 'PLAYING',
    'tags': [],
    'thumbnail': {
      'id': 'SW1hZ2U6MTE4NzkxMDYyOA==',
      'smallImage': 'https://picsum.photos/414/736',
      'biggerImage': 'https://picsum.photos/640/1138',
      'fullSizeImage': 'https://picsum.photos/1080/1920',
      '__typename': 'Image',
    },
    'trailerUrl': null,
    'title': 'Variety Color Breaks <3 CMM, EOE, KAMI, MB2 & Friends',
    'user': {
      'username': 'mana_rock_games',
      'id': '23672038',
      'profileImage': {
        'id': '588337627',
        'url': 'https://picsum.photos/200/200?random=1',
      },
      'isPremierShop': false,
    },
  },
  {
    'id': '8a3d436f-454d-4b8b-9a53-53c66c1879e1',
    'activeViewers': 120,
    'livestreamCategories': [
      {
        'id': 'TGl2ZXN0cmVhbVRhZ05vZGU6OTQx',
        'label': 'Pokémon Cards',
        'deeplink': 'tag/pokemon_cards',
        '__typename': 'LivestreamTagNode',
      },
    ],
    'startTime': 1777603428208.0,
    'status': 'PLAYING',
    'tags': [],
    'thumbnail': {
      'id': 'SW1hZ2U6MTE4NzkxMDYyOQ==',
      'smallImage': 'https://picsum.photos/414/736?random=2',
      'biggerImage': 'https://picsum.photos/640/1138?random=2',
      'fullSizeImage': 'https://picsum.photos/1080/1920?random=2',
      '__typename': 'Image',
    },
    'trailerUrl': null,
    'title': 'Vintage Pokemon Box Breaks! Charizard Hunting!',
    'user': {
      'username': 'poke_master_ash',
      'id': '23672039',
      'profileImage': {
        'id': '588337628',
        'url': 'https://picsum.photos/200/200?random=2',
      },
      'isPremierShop': true,
    },
  },
  {
    'id': '9b3d436f-454d-4b8b-9a53-53c66c1879e2',
    'activeViewers': 85,
    'livestreamCategories': [
      {
        'id': 'TGl2ZXN0cmVhbVRhZ05vZGU6OTQy',
        'label': 'Comics',
        'deeplink': 'tag/comics',
        '__typename': 'LivestreamTagNode',
      },
    ],
    'startTime': 1777604428208.0,
    'status': 'PLAYING',
    'tags': [],
    'thumbnail': {
      'id': 'SW1hZ2U6MTE4NzkxMDYzMA==',
      'smallImage': 'https://picsum.photos/414/736?random=3',
      'biggerImage': 'https://picsum.photos/640/1138?random=3',
      'fullSizeImage': 'https://picsum.photos/1080/1920?random=3',
      '__typename': 'Image',
    },
    'trailerUrl': null,
    'title': 'CGC Slabs & Raw Grails - Marvel & DC',
    'user': {
      'username': 'comic_collector_101',
      'id': '23672040',
      'profileImage': {
        'id': '588337629',
        'url': 'https://picsum.photos/200/200?random=3',
      },
      'isPremierShop': false,
    },
  },
]
