import { TweenMax, Power4 } from 'gsap';
import $ from 'jquery';

const Engine = {
  ui: {
    initHover: function(e) {
      $(document).on("mousemove", ".cardOnb", function(e) {
        if ($('body').hasClass('is-open')) {
          e.preventDefault();
        } else {
          var halfW = (this.clientWidth / 2);
          var halfH = (this.clientHeight / 2);

          var coorX = (halfW - (e.pageX - this.offsetLeft));
          var coorY = (halfH - (e.pageY - this.offsetTop));

          var degX = ((coorY / halfH) * 10) + 'deg';
          var degY = ((coorX / halfW) * -10) + 'deg';

          $(this).css('transform', function() {
            return 'perspective(1600px) translate3d(0, 0px, 0) scale(0.6) rotateX(' + degX + ') rotateY(' + degY + ')';
          }).children('.cardOnb-title-wrap').css('transform', function() {
            return 'perspective(1600px) translate3d(0, 0, 200px) rotateX(' + degX + ') rotateY(' + degY + ')';
          });
        }
      }).on("mouseout", ".cardOnb", function() {
        $(this).removeAttr('style').children('.cardOnb-title-wrap').removeAttr('style');
      });
    }
  }
};

Engine.ui.initHover();

export { Engine };