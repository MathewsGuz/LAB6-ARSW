var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        //creando un objeto literal
        //enviando un objeto creado a partir de una clase
        //stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function (id) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+id, function (eventbody) {
                var theObject=JSON.parse(eventbody.body);
                addPointToCanvas(theObject);
                //alert("el nuevo punto es "+theObject.x+" en x "+theObject.y+" en y");
                
            });
             stompClient.subscribe('/topic/newpolygon.'+identifier, function (eventbody){
                var polygono = JSON.parse(eventbody.body);
                addPolygonToCanvas(polygono);//aun no se crea la funcion
            });
        });

    };
    
    var addPolygonToCanvas= function(polygono) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(polygon[0].x,polygon[0].y);
        ctx.lineTo(polygon[1].x,polygon[1].y);
        ctx.lineTo(polygon[2].x,polygon[2].y);
        ctx.lineTo(polygon[3].x,polygon[3].y);
        ctx.closePath();
        ctx.fill();
    };
    
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            $(can).click(function (e){
                var pt = new Point(getMousePosition(e).x,getMousePosition(e).y);
                addPointToCanvas(pt);
                stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
            });
            //websocket connection
            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
            //stompClient.send("/app/newpoint", {}, JSON.stringify(pt)); 
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },
        connect : function(id){
            var can = document.getElementById("canvas");
            connectAndSubscribe(id);
            $(can).click(function (e){
                var pt = new Point(getMousePosition(e).x,getMousePosition(e).y);
                addPointToCanvas(pt);
                stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));
                stompClient.send("/app/newpoint."+id, {}, JSON.stringify(pt)); 
            });
        }
        
    };

})();