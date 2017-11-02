
$.fn.RangeSlider = function(cfg,classname){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;


    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        if(classname=="income"){
            $("."+classname).html(Math.round(this.value)+"万");
            $(".moneyNum").css("left",8+this.value*0.355+"%");
        }else{
            $("."+classname).html(Math.round(this.value));        
        
        }
        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};