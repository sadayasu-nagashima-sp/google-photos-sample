<template>
  <div>
    <div>
      <button
        @click="
          () => {
            isLogin ? signOut() : signIn();
          }
        "
      >
        {{ isLogin ? "ログアウト" : "ログイン" }}（google photos）
      </button>
    </div>
    <div v-if="isLogin">
      <button @click="getAlbumList">アルバムリスト取得</button>
      <template v-if="albums.length > 0">
        <div v-for="(album, index) in albums" :key="index">
          <button @click="getPhotos(album.id)">
            {{ `写真取得(${album.title})` }}
          </button>
        </div>
        <div>
          <button @click="getPhotos()">写真取得(すべて)</button>
        </div>
      </template>
      <template v-if="photos.length > 0">
        <img :src="photo.baseUrl" v-for="photo in photos" :key="photo.id" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "GooglePhotoSample",
  props: {
    msg: String,
  },
  data() {
    return {
      isInit: false,
      isAuthorized: false,
      authResponse: null,
      albums: [],
      photos: [],
      nextPageToken: null,
    };
  },
  mounted() {
    this.initialize();
    const checkGauthLoad = setInterval(() => {
      this.isInit = this.$gAuth.isInit;
      this.isAuthorized = this.$gAuth.isAuthorized;

      if (this.isInit) {
        clearInterval(checkGauthLoad);
        this.$gAuth.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
      }
    }, 1000);
  },
  beforeUnmount() {
    this.initialize();
  },
  computed: {
    isLogin() {
      return this.isInit && this.isAuthorized;
    },
  },
  methods: {
    initialize() {
      this.isAuthorized = false;
      this.authResponse = null;
      this.albums = [];
      this.photos = [];
    },
    signIn() {
      this.$gAuth
        .signIn()
        .then((authUser) => {
          this.authResponse = authUser.getAuthResponse();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    signOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          this.initialize();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateSigninStatus() {
      this.isAuthorized = this.$gAuth.isAuthorized;
    },
    getAlbumList() {
      fetch("https://photoslibrary.googleapis.com/v1/albums", {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + this.authResponse.access_token,
        }),
      })
        .then((res) => res.text())
        .then((text) => {
          this.albums = JSON.parse(text).albums;
        });
    },
    getPhotos(albumId) {
      fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + this.authResponse.access_token,
        }),
        body: JSON.stringify({
          albumId,
          pageSize: 10,
          pageToken: this.nextPageToken,
          orderBy: "MediaMetadata.creation_time desc",
        }),
      })
        .then((res) => res.text())
        .then((text) => {
          this.nextPageToken = JSON.parse(text).nextPageToken;
          this.photos = JSON.parse(text).mediaItems.filter((item) => {
            return item.mediaMetadata.photo;
          });
        });
    },
  },
};
</script>

<style scoped>
button {
  width: 200px;
  text-align: left;
}
</style>
