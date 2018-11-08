/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint.controller;

/**
 *
 * @author Guzman
 */
@Controller
public class STOMPMessagesHandler {
    
    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numdibujo}")    
    public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        msgt.convertAndSend("/topic/newpoint"+numdibujo, pt);
    }

}
