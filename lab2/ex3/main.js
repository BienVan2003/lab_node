let url1 = '/students/123x'
let url2 = '/students/123x/'
let url3 = '/students/123x///'
let url4 = '/students/123x/abc' // invalid
let url5 = '/students/' // invalid

let pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig

// console.log(url1.match(pattern));
// console.log(url2.match(pattern));
// console.log(url3.match(pattern));
// console.log(url4.match(pattern));
// console.log(url5.match(pattern));

let IdPattern = /[a-zA-Z0-9]+\/*$/ig

// console.log(url1.match(IdPattern));
// console.log(url2.match(IdPattern));
// console.log(url3.match(IdPattern));
// console.log(url4.match(IdPattern));
// console.log(url5.match(IdPattern));

console.log(url1.match(IdPattern)[0].replace(/\/*$/ig, ''));
console.log(url2.match(IdPattern)[0].replace(/\/*$/ig, ''));
console.log(url3.match(IdPattern)[0].replace(/\/*$/ig, ''));