
   
    d3.csv("./data/top_100_youtubers.csv").then(function(data) {
      
      const catUnique = [...new Set(data.map(d => d.Category))].sort() //select only unique values of countries
      const channelUnique = [...new Set(data.map(d => d.ChannelName))].sort() 
      let catSumValue = 0;
      let channelSumValue =0;
      let channelLikeValue = 0;
      let catAllValues = [];
      let channelAllValues = [];
      let channelLikesValues = [];
      Object.keys(catUnique).forEach(index => {
        catSumValue = 0;
        Object.entries(data).forEach(entry => {
            const [key, item] = entry;
            if (catUnique[index] === item.Category) {
                catSumValue =  catSumValue + parseInt(item.followers)
            }
            
        });
        // reconstruct the data
        catAllValues.push({
            category: catUnique[index],
            value: catSumValue
        });
    });
        Object.keys(channelUnique).forEach(index => {
            channelSumValue = 0;
            channelLikeValue = 0;
            Object.entries(data).forEach(entry => {
                const [key, item] = entry;
                if (channelUnique[index] === item.ChannelName) {
           
                    channelSumValue =  channelSumValue + parseInt(item.followers)
                }
              
            });
            // reconstruct the data
            channelAllValues.push({
                channel: channelUnique[index],
                value:  channelSumValue,
            });
         });

        
        Object.keys(channelUnique).forEach(index => {
            channelLikeValue = 0;
            Object.entries(data).forEach(entry => {
                const [key, item] = entry;
                if (channelUnique[index] === item.ChannelName) {
           
                    channelLikeValue =  channelLikeValue + parseInt(item.Likes)
                }
              
            });
            // reconstruct the data
            channelLikesValues.push({
                channel: channelUnique[index],
                value:  channelLikeValue,
            });
         });
    const topCatFollowers =catAllValues.sort(function(a, b) {
        return b.value - a.value
      })
      const topChannelSubs =channelAllValues.sort(function(a, b) {
        return b.value - a.value
      })

      const topChannelLikes = channelLikesValues.sort(function(a, b) {
        return b.value - a.value
      })
      console.log(topChannelLikes, '<<')

     //for stat chart value
     const flag = document.getElementById('top-category-followers');
     flag.innerHTML =  '<div class="fs-4">'+topCatFollowers[0].category+'</div>';;
     const flagVal = document.getElementById('top-category-followers-value');
     const num = topCatFollowers[0].value;
     flagVal.innerHTML = Math.sign(num)*((Math.abs(num)/1000000000).toFixed(1)) + 'B';

     const flag1 = document.getElementById('top-channel-followers');
     flag1.innerHTML =  '<div class="fs-4">'+topChannelSubs[0].channel+'</div>';;
     const flagVal1 = document.getElementById('top-channel-followers-value');
     const num1 =topChannelSubs[0].value;
     flagVal1.innerHTML = Math.sign(num1)*((Math.abs(num1)/1000000).toFixed(1)) + 'M';

     const flag2 = document.getElementById('top-channel-likes');
     flag2.innerHTML =  '<div class="fs-4">'+topChannelLikes[0].channel+'</div>';;
     const flagVal2 = document.getElementById('top-channel-likes-value');
     const num2 = topChannelLikes[0].value;
     flagVal2.innerHTML = Math.sign(num2)*((Math.abs(num2)/1000000000).toFixed(1)) + 'B';

    });
   