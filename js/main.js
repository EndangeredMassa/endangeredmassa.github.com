// this should be done server side, but here we are
if(document.querySelectorAll) {
  function toArray(arrayLike) {
    for(var realArray=[], l=arrayLike.length; l--; realArray[l]=arrayLike[l]);
    return realArray;
  }

  window.onload = function(){
    var tables = toArray(document.querySelectorAll('table'));
    tables.forEach(function(table){
      table.className = 'pure-table';
    });
  };
}
