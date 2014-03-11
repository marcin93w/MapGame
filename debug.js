/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Debug = new function() {
    var container = null;
    function getContainer() {
        if(container === null) {
            container = document.getElementById('debug');
        }
        return container;
    }
    
    this.message = function(message) {
        var container = getContainer();
        container.innerHTML = message+'<br />';
        container.style.color = 'red';
        setTimeout(function() {
            container.style.color = 'black';
        }, 1000);
    };
};


