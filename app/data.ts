export interface Image {
  id: string;
  smallImage?: string;
  biggerImage?: string;
  fullSizeImage?: string;
  url?: string;
  __typename?: string;
}

export interface User {
  id: string;
  username: string;
  profileImage: Image;
  isPremierShop: boolean;
}

export interface LivestreamCategory {
  id: string;
  label: string;
  deeplink: string;
  __typename?: string;
}

export interface Livestream {
  id: string;
  activeViewers: number;
  livestreamCategories: LivestreamCategory[];
  startTime: number;
  status: string;
  tags: string[];
  thumbnail: Image;
  trailerUrl: string | null;
  title: string;
  user: User;
}

export const mockLivestreams: Livestream[] = [
  {
    "id": "793d436f-454d-4b8b-9a53-53c66c1879e0",
    "activeViewers": 40,
    "livestreamCategories": [
      {
        "id": "TGl2ZXN0cmVhbVRhZ05vZGU6OTQw",
        "label": "Magic: The Gathering",
        "deeplink": "tag/magic_cards",
        "__typename": "LivestreamTagNode"
      }
    ],
    "startTime": 1777602428208.0,
    "status": "PLAYING",
    "tags": [],
    "thumbnail": {
      "id": "SW1hZ2U6MTE4NzkxMDYyOA==",
      "smallImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy9hOTlhMDdkNy02OTgxLTQ3ZTMtYTk3NC05OTk3YTA1YmFmZjAucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNDE0LCAiaGVpZ2h0IjogNjQwLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=456e2367b76d2e63885390ad210483a3b695c382ffaa9edb14e27aaefd1e72b2",
      "biggerImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy9hOTlhMDdkNy02OTgxLTQ3ZTMtYTk3NC05OTk3YTA1YmFmZjAucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNjQyLCAiaGVpZ2h0IjogOTkyLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=44c142b79d73d22a072386eb30a2f0482b7e0fbf8960ea4f5006d3387dd8d99d",
      "fullSizeImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy9hOTlhMDdkNy02OTgxLTQ3ZTMtYTk3NC05OTk3YTA1YmFmZjAucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogbnVsbCwgImhlaWdodCI6IG51bGwsICJmaXQiOiAiY292ZXIiLCAiYmFja2dyb3VuZCI6IHsiciI6IDI1NSwgImciOiAyNTUsICJiIjogMjU1LCAiYWxwaGEiOiAxfX19LCAib3V0cHV0Rm9ybWF0IjogIndlYnAifQ==?signature=26acf31a9bfd37564e537e67fcf6dd793dfdd15b4b077ebb682f032a862c7af5",
      "__typename": "Image"
    },
    "trailerUrl": null,
    "title": "Variety Color Breaks <3 CMM, EOE, KAMI, MB2 & Friends",
    "user": {
      "username": "mana_rock_games",
      "id": "23672038",
      "profileImage": {
        "id": "588337627",
        "url": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogInVzZXJzLzIzNjcyMDM4L2YxMjI2Yjk1LTZmYTktNDgxMS1iY2JiLWQwNTI3MTYyM2RkMy5wbmciLCAiZWRpdHMiOiB7InJlc2l6ZSI6IHsid2lkdGgiOiBudWxsLCAiaGVpZ2h0IjogbnVsbCwgImZpdCI6ICJjb250YWluIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fX0=?signature=5ecf2cd1cd9cc0869027f1d13abd40cdb2ba080c3751dbc0dc3af987c92acb62"
      },
      "isPremierShop": false
    }
  },
  {
    "id": "8a3d436f-454d-4b8b-9a53-53c66c1879e1",
    "activeViewers": 120,
    "livestreamCategories": [
      {
        "id": "TGl2ZXN0cmVhbVRhZ05vZGU6OTQx",
        "label": "Pokémon Cards",
        "deeplink": "tag/pokemon_cards",
        "__typename": "LivestreamTagNode"
      }
    ],
    "startTime": 1777603428208.0,
    "status": "PLAYING",
    "tags": [],
    "thumbnail": {
      "id": "SW1hZ2U6MTE4NzkxMDYyOQ==",
      "smallImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8zMGJmZmFlMC0wNGEzLTRhYTktYjIyOC1jZjA4MzZkZTY3ZmIucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNDE0LCAiaGVpZ2h0IjogNjQwLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=028b122fdfbf931238634177b94ce5e22934a36f90d421d092c4ee94589255a2",
      "biggerImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8zMGJmZmFlMC0wNGEzLTRhYTktYjIyOC1jZjA4MzZkZTY3ZmIucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNjQyLCAiaGVpZ2h0IjogOTkyLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=c8d35f4b00511f5ab8167f671c696e5ce7163f5dcd2bbba1d187212eb12727a2",
      "fullSizeImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8zMGJmZmFlMC0wNGEzLTRhYTktYjIyOC1jZjA4MzZkZTY3ZmIucG5nIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogbnVsbCwgImhlaWdodCI6IG51bGwsICJmaXQiOiAiY292ZXIiLCAiYmFja2dyb3VuZCI6IHsiciI6IDI1NSwgImciOiAyNTUsICJiIjogMjU1LCAiYWxwaGEiOiAxfX19LCAib3V0cHV0Rm9ybWF0IjogIndlYnAifQ==?signature=ddf08a47cae21712a76f2edff00c3b313efbdde6f3d1bcfba9dd0ab1432f6b86",
      "__typename": "Image"
    },
    "trailerUrl": null,
    "title": "Vintage Pokemon Box Breaks! Charizard Hunting!",
    "user": {
      "username": "poke_master_ash",
      "id": "23672039",
      "profileImage": {
        "id": "588337628",
        "url": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogInVzZXJzLzQyODMxOTcvOTBiNDExYjYtODcyMC00MDk2LTlkZTItZGQzNzgwYjI3MjRhLmpwZyIsICJlZGl0cyI6IHsicmVzaXplIjogeyJ3aWR0aCI6IG51bGwsICJoZWlnaHQiOiBudWxsLCAiZml0IjogImNvbnRhaW4iLCAiYmFja2dyb3VuZCI6IHsiciI6IDI1NSwgImciOiAyNTUsICJiIjogMjU1LCAiYWxwaGEiOiAxfX19fQ==?signature=7888746ba435010972b21cfb77b78918ddfbb5a013c72b26b3345423f79ef602"
      },
      "isPremierShop": true
    }
  },
  {
    "id": "9b3d436f-454d-4b8b-9a53-53c66c1879e2",
    "activeViewers": 85,
    "livestreamCategories": [
      {
        "id": "TGl2ZXN0cmVhbVRhZ05vZGU6OTQy",
        "label": "Comics",
        "deeplink": "tag/comics",
        "__typename": "LivestreamTagNode"
      }
    ],
    "startTime": 1777604428208.0,
    "status": "PLAYING",
    "tags": [],
    "thumbnail": {
      "id": "SW1hZ2U6MTE4NzkxMDYzMA==",
      "smallImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8xYzYyZjA2Yi0yMDMzLTQwNWYtYmMyMi0wZWE2ODk5ZTFmZTguanBnIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNDE0LCAiaGVpZ2h0IjogNjQwLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=025e1a3b4c101d2c67db8a91a95267252277c0b05b3cb29df34d8fb85fba3df5",
      "biggerImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8xYzYyZjA2Yi0yMDMzLTQwNWYtYmMyMi0wZWE2ODk5ZTFmZTguanBnIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogNjQyLCAiaGVpZ2h0IjogOTkyLCAiZml0IjogImNvdmVyIiwgImJhY2tncm91bmQiOiB7InIiOiAyNTUsICJnIjogMjU1LCAiYiI6IDI1NSwgImFscGhhIjogMX19fSwgIm91dHB1dEZvcm1hdCI6ICJ3ZWJwIn0=?signature=0a6d1a9a8cd4f971ba46d8ba9663d1e04134b2203e915555e1c0c6e4e0cfd80e",
      "fullSizeImage": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogImxpdmVzdHJlYW1fdGh1bWJuYWlscy8xYzYyZjA2Yi0yMDMzLTQwNWYtYmMyMi0wZWE2ODk5ZTFmZTguanBnIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogbnVsbCwgImhlaWdodCI6IG51bGwsICJmaXQiOiAiY292ZXIiLCAiYmFja2dyb3VuZCI6IHsiciI6IDI1NSwgImciOiAyNTUsICJiIjogMjU1LCAiYWxwaGEiOiAxfX19LCAib3V0cHV0Rm9ybWF0IjogIndlYnAifQ==?signature=448e8cb4eb41431d102e3dc412e624c47814b74e14285800045fcaf3bc6a2414",
      "__typename": "Image"
    },
    "trailerUrl": null,
    "title": "CGC Slabs & Raw Grails - Marvel & DC",
    "user": {
      "username": "comic_collector_101",
      "id": "23672040",
      "profileImage": {
        "id": "588337629",
        "url": "https://images.whatnot.com/eyJidWNrZXQiOiAid2hhdG5vdC1pbWFnZXMiLCAia2V5IjogInVzZXJzLzg3MjEwOC8xMGQ0MWIzMS1iMjRiLTRiMGQtODBhMy1lYTdjOTg1OTY4NGEuanBnIiwgImVkaXRzIjogeyJyZXNpemUiOiB7IndpZHRoIjogbnVsbCwgImhlaWdodCI6IG51bGwsICJmaXQiOiAiY292ZXIiLCAiYmFja2dyb3VuZCI6IHsiciI6IDI1NSwgImciOiAyNTUsICJiIjogMjU1LCAiYWxwaGEiOiAxfX19fQ==?signature=d901a1db1f3910543e0fde4d812260e0a54e9e03d3600c6d57cc14a6e0c03ba8"
      },
      "isPremierShop": false
    }
  }
];
