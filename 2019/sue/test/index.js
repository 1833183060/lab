new Sue({
  el: document,
  data: {
    'qwq{': '我是qwq',
    orz: '我是orz'
  },
  created: function() {
    console.log('渲染开始');
    //document.body.setAttribute('style', 'display: none');
  },
  rendered: function() {
    console.log('渲染结束');
    //document.body.setAttribute('style', '');
  }
});


