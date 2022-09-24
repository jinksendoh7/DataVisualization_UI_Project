$("#v-pills-tab a").click(function(e){
    e.preventDefault();
    document.getElementById('spinner').style.display = 'block'
    document.getElementById('v-pills-tabContent').style.display = 'none';
    setTimeout(()=>{
        document.getElementById('spinner').style.display = 'none'
        document.getElementById('v-pills-tabContent').style.display = 'block';
        $(this).tab("show");
    },1000)
});