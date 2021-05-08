const stopwords = require('stopwords')
const http = require('http')

const map =  new Map()

const findTopTenWords = async function (url) {
    return new Promise(function(resolve, reject) {
    http.get(url, function(res) { 
        console.log('start date', new Date())
        res.on('data', function(chunk) {
            let str = chunk.toString('utf-8').replace(/[^a-z'\s]/gi, '').replace(/[_\s]/g, ' ')
            findOccurenceOfWords(str)
        })  
      
        res.on('end', function() {
            console.log('end date', new Date())
            const topTenWords = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
            return resolve({status:true, data: topTenWords})
        })

        res.on('error', (err) => {
            return reject({status:false})
        })
      })
})
}


function findOccurenceOfWords(str) {
    str.split(' ').forEach(function(el, i, arr) {
        if(!stopwords.english.includes(el) && el){
            if(map.has(el)){
                map.set(el, map.get(el)+1)
            }else{
                map.set(el, 1)
            }
        }
    })
}

module.exports = findTopTenWords