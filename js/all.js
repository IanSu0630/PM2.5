// API 來源
// https://opendata.epa.gov.tw/Data/Contents/AQI/
Vue.component('card',{
    props:['data'],
    template:`
    <div class="card" :class="statusColor">
        <div class="card-header">{{data.County}} ─ {{data.SiteName}}
          <a href="#" class="float-right" @click.prevent="tagStar">
          <slot name = "icon">
            <i class="far fa-star"></i>
          </slot>
          </a>
        </div>
        
        <div class="card-body">
          <ul class="list-unstyled">
            <li>AQI 指數: {{data.AQI}}</li>
            <li>PM2.5: {{data['PM2.5']}}</li>
            <li>說明: {{data.Status}}</li>
          </ul>
        {{data.PublishTime}}
        </div>
      </div>`,
    computed:{
      statusColor:function(){
        switch(this.data.Status){
          case '良好': {
            return'';
            break;
          }
          case '普通': {
            return 'status-aqi2';
            break;
          }
          case '對敏感族群不健康': {
            return 'status-aqi3';
            break;
          }
          case '對所有族群不健康': {
            return 'status-aqi4';
            break;
          }
          case '非常不健康': {
            return 'status-aqi5';
            break;
          }
          case '危害': {
            return 'status-aqi6';
            break;
          }
        }
      },
    },
    methods:{
      tagStar:function(){
        this.$emit('event',this.data.SiteName);
      }
    }
  })

  var app = new Vue({
    el: '#app',
    data: {
      data: [],
      location: [],
      stared:JSON.parse(localStorage.getItem('stared')) || [],
      filter: '',
    },
    methods: {
      getData:function() {
        const vm = this;
        const api = 'https://script.google.com/macros/s/AKfycbzl6KKgb4v2-F3SCVxVaXjnMwM_XQvnk2A08nw7NjmGfuRVmak0/exec?url=http://opendata2.epa.gov.tw/AQI.json';
        // 使用 jQuery ajax
        $.get(api).then(function( response ) {
          vm.data = response;
          vm.data.forEach(function(item,index){
            vm.location.push(item.County);
          });
          vm.location = vm.location.filter(function(item,index,arr){
            return arr.indexOf(item) === index;
          })
          console.log(response) 
        });
      },
      siteNameStar:function(SiteName){
        const vm = this;
        var index = vm.stared.findIndex(function(item){
          return item == SiteName;
        });
        console.log(index);
        if(index == -1){
          vm.stared.push(SiteName);
        }else{
          vm.stared.splice(index,1);
        }
        localStorage.setItem('stared', JSON.stringify(vm.stared));
      }
    },
    computed: {
      filterData:function(){
        const vm = this;
        if(vm.filter !==''){
          return vm.data.filter(function(item){
            // return item.County == vm.filter ;
            if(item.County == vm.filter){
              return vm.stared.indexOf(item.SiteName) === -1;   
            }
            
          })
        }else{
          // return vm.data;
          return vm.data.filter(function(item){
            return vm.stared.indexOf(item.SiteName)===-1;
          })
        }
      },
      siteData:function(){
        const vm = this;
        return vm.data.filter(function(item){
          return vm.stared.indexOf(item.SiteName) > -1
        })
      }
    },
    created() {
      this.getData();
    },
  });