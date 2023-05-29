const sorterOptions = {
  'Original Position': 'original_position',
  'Name': 'name',
  'Album Name': 'album_name',
  'Artist Name': 'artist_name',
  'Release Date': 'release_date',
  'Popularity': 'popularity',
  'Date Added': 'date_added',
  'Tempo': 'tempo',
  'Acousticness': 'acousticness',
  'Danceability': 'danceability',
  'Energy': 'energy',
  'Instrumentalness': 'instrumentalness',
  'Liveness': 'liveness',
  'Loudness': 'loudness',
  'Speechiness': 'speechiness',
  'Valence': 'valence',
};

const iconOptions = {
  'Original Position': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
  'Album Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
  'Artist Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
  'Release Date': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Popularity': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Date Added': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Tempo': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Acousticness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Danceability': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Energy': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Instrumentalness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Liveness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Loudness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Speechiness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  'Valence': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
};

const iconOptionsLeft = {
  'Original Position': 'hashtag',
  'Name': 'list-ol',
  'Album Name': 'compact-disc',
  'Artist Name': 'user',
  'Release Date': 'calendar-alt',
  'Popularity': 'fire',
  'Date Added': 'calendar-plus',
  'Tempo': 'tachometer-alt',
  'Acousticness': 'wave-square',
  'Danceability': 'walking',
  'Energy': 'bolt',
  'Instrumentalness': 'guitar',
  'Liveness': 'microphone-alt',
  'Loudness': 'volume-up',
  'Speechiness': 'comment-alt',
  'Valence': 'heart',
};


const sorterDirections = {
  'asc': 'Ascending',
  'desc': 'Descending',
};

export { sorterOptions, sorterDirections, iconOptions, iconOptionsLeft };