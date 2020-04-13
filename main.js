

// Timer Part Start

// this line to prevent user from writing in number inputs
$(".timer input.duration").keypress(e => { e.preventDefault() })

// when this ecent is occured the text of the remaining time changes
$(".timer .inputs input").change(function () {
    $(".remaining span").eq($(this).index() / 2).text(($(this).val().length == 1)? `0${$(this).val()}` : $(this).val())
})

let isWorking = true,
    vals,
    timeInMsec,
    needleAangle,
    needleTickTockSound = new Audio("timer.mp3")

$(".timer .button.start").click(function () {

    vals = [Number($(".h").val()), Number($(".m").val()), Number($(".s").val())],
    needleAangle = 0,
    timeInMsec = (1000 * (vals[2] + vals[1] * 60 + vals[0] * 3600)) + 1000

    // if this satatement is true, the timer will began 
    if(vals.reduce((t, e) => e+t,0) > 0){

        isWorking = true
        $(".timer .button.toggle").addClass("pause").removeClass("continue").text("Pause")

        $(".needle").css("opacity",`1`)

        $(this).hide("fast", function () {
            $(this).siblings().show("fast")
        })
        $(".inputs input").prop("disabled", true)

        
        // we set the width of the line here
        $(".line").animate({
            width : 100 + "vw"
        } , {
            duration: timeInMsec,
            easing :  "linear",
            progress : function (_, prog){
                $(this).text(`${(prog * 100).toFixed(2)}%`)
            }
        })
        
        //  start of animation
        let timerAn = setInterval(function(){
            
            
            
            // reset button
            $(".timer .button.reset").click(function () {
                $(".remaining").html(`<span>00</span>h <span>00</span>min <span>00</span>s`)
                stopTimer()
            })
            $(".needle").css("transform", `rotate(${needleAangle}deg)`)
            // this line write the remaining time in the dom and add a 0 to numbers from 0 to 9 to be like: 08 04 00...
            $(".remaining").html(`<span>${([vals[0]].toString().length == 1)? `0${vals[0]}` : vals[0]}</span>h <span>${([vals[1]].toString().length == 1)? `0${vals[1]}` : vals[1]}</span>min <span>${([vals[2]].toString().length == 1)? `0${vals[2]}` : vals[2]}</span>s`)
            

            // these if statement is for correct time progress
            if(isWorking){

                // needle animation
                needleAangle += (360/60)

                needleTickTockSound.currentTime = 0
                needleTickTockSound.play()

                if (vals[2] > 0) 
                    vals[2] = vals[2] - 1
                else {
                    if (vals[1] > 0)
                        [vals[2], vals[1]] = [59, vals[1] - 1]
                    else {
                        if (vals[0] > 0) 
                            [vals[2], vals[1], vals[0]] = [59, 59, vals[0] - 1]
                        else {
                            // the timer has finished here
                            stopTimer()
                        }
                    }
                }
            }

            // this line write the remaining time in the dom and add a 0 to numbers from 0 to 9 to be like: 08 04 00...
            $(".remaining").html(`<span>${([vals[0]].toString().length == 1)? `0${vals[0]}` : vals[0]}</span>h <span>${([vals[1]].toString().length == 1)? `0${vals[1]}` : vals[1]}</span>min <span>${([vals[2]].toString().length == 1)? `0${vals[2]}` : vals[2]}</span>s`)

            // this line set the angle of the needle
            $(".needle").css("transform", `rotate(${needleAangle}deg)`)


        }, 1000)

        // this function is called when the timer finishes or the user click reset button
        function stopTimer(){

            
            $(".timer .start").siblings().hide("fast", function () {
                $(".timer .start").show("fast")
            })
            $(".inputs input").prop("disabled", false).val("00")

            clearInterval(timerAn)

            needleTickTockSound.pause()
            needleTickTockSound.currentTime = 0

            $(".line").stop()
            $(".line").width(0)

            needleAangle = 0
            $(".needle").css({
                "opacity":`0`,
                "transform": `rotate(0deg)`
            })
        }

    }

})


// Pause and Continue part
$(".timer .button.toggle").click(function () {

    if($(this).hasClass("pause")){

        isWorking = false
        $(".line").stop()
        needleTickTockSound.pause()
    } else {

        let NewtimeInMsec = timeInMsec - (($(".line").width() / $(window).width()) * timeInMsec),
            Newprog = ($(".line").width() / $(window).width()) * 100

        $(".line").animate({
            width : 100 + "vw"
        }, {
            duration: NewtimeInMsec,
            easing :  "linear",
            progress : function (){
                Newprog = ($(".line").width() / $(window).width())
                $(this).text(`${(Newprog * 100).toFixed(2)}%`)
            }
        })

        isWorking = true
        
        
        needleTickTockSound.play()
    }

    $(this).toggleClass("continue pause").text(($(this).hasClass("pause"))? "Pause":"Continue")
})


// Timer Part End









// Stopwatch Part Start


let time = [0, 0, 0, 0],
isStopWatchrunning = true,
pointerAngle = 0,
stopwatchRingSound = new Audio("stopwatch.mp3")

$(".stopwatch .actions .start").click(function () {
    
    isStopWatchrunning = true

    $(".stopwatch .button.toggle").addClass("pause").removeClass("continue").text("Pause")

    $(".pointer").css("opacity",`1`)

    $(this).hide("fast", function () {
        $(this).siblings().show("fast")
    })

    
    //  start of animation
    let stopWatchAn = setInterval(function(){
    

        $(".pointer").css("transform", `rotate(${pointerAngle}deg)`)

        // this line write the remaining time in the dom and add a 0 to numbers from 0 to 9 to be like: 08 04 00...
        $(".time").html(`${([time[0]].toString().length == 1)? `0${time[0]}` : time[0]}:${([time[1]].toString().length == 1)? `0${time[1]}` : time[1]}:${([time[2]].toString().length == 1)? `0${time[2]}` : time[2]}:${([time[3]].toString().length == 1)? `0${time[3]}` : time[3]}`)
        

        // these if statement is for correct time progress
        if(isStopWatchrunning){

            // needle animation
            pointerAngle += (360/100)
            
            if(!(Math.round(pointerAngle) % 360)){
                stopwatchRingSound.play()
            }
            if(time[3] == 99)
                [time[3], time[2]] = [0, time[2] + 1]
            else{
                if (time[2] == 59) 
                    [time[2], time[1]] = [0, time[1] + 1]
                else {
                    if (time[1] == 59)
                        [time[1], time[0]] = [0, time[0] + 1]
                    else {
                        time[3]++
                    }
                }
            }
        }

        // this line write the remaining time in the dom and add a 0 to numbers from 0 to 9 to be like: 08 04 00...
        $(".time").html(`${([time[0]].toString().length == 1)? `0${time[0]}` : time[0]}:${([time[1]].toString().length == 1)? `0${time[1]}` : time[1]}:${([time[2]].toString().length == 1)? `0${time[2]}` : time[2]}:${([time[3]].toString().length == 1)? `0${time[3]}` : time[3]}`)

        // this line set the angle of the needle
        $(".pointer").css("transform", `rotate(${pointerAngle}deg)`)


    }, 10)
    

    
    // reset button
    $(".stopwatch .button.reset").click(function () {
        $(".time").html(`00:00:00:00`)
        stopStopWatch()
    })

    // the function that get called when the user click reset
    function stopStopWatch(){

        $(".stopwatch .button.start").siblings().hide("fast", function () {
            $(".stopwatch .button.start").show("fast")
        })
        time = [0, 0, 0, 0]
        clearInterval(stopWatchAn)


        pointerAngle = 0
        $(".pointer").css({
            "opacity":`0`,
            "transform": `rotate(0deg)`
        })
    }

})

// Pause and Continue part
$(".stopwatch .button.toggle").click(function () {

    if($(this).hasClass("pause")){
        isStopWatchrunning = false
    } else {
        isStopWatchrunning = true
    }

    $(this).toggleClass("continue pause").text(($(this).hasClass("pause"))? "Pause":"Continue")
})


// StopWatch Part End



// Themes and local Storage Part Start 

let firstTheme = localStorage.getItem("theme"),
    activeChild = localStorage.getItem("activeIndex")
if(firstTheme && activeChild){
    $("body").removeClass().addClass(firstTheme)
    $(".theme").eq(Number(activeChild)).addClass("active").siblings().removeClass("active")
}
$(".theme").click(function (){
    $(this).addClass("active").siblings().removeClass("active")
    $("body").removeClass().addClass($(this).data("theme"))
    localStorage.setItem("theme", $(this).data("theme"))
    localStorage.setItem("activeIndex", $(this).index())
})



// Themes and local Storage Part End