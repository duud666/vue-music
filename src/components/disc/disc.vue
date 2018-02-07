<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs">
      
    </music-list>
    
   
  </transition>

</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'

  export default {
     data() {
      return {
        songs: []
      }
    },
    computed: {
      //计算监听是否变化
      title() {
      //计算监听题目变化
        return this.disc.dissname
      },
      bgImage() {
      //计算监听背景图变化
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    
    created(){
      this._getSongList()
    },
    methods:{
      _getSongList() {
       if(!this.disc.dissid){
        this.$router.push('/recommend')
        return
       }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            //抓取歌单失效，暂时不会弄
            //this.songs=this._normalizeSongs(res.cdlist[0].songlist)
            //console.log(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list){
        let ret =[]
        list.forEach((musicData)=>{
          if(musicData.songid&&musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>