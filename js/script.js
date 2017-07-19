/**
 * 
 * @authors ${jsx} (${92332823@qq.com})
 * @date    2017-07-18
 * @version $Id$
 */
(function($){
	var video = $("#myVieo");

	video.width($(".vContainer").width());
	video.height($(".vContainer").height());

	var showTitleAndControl = function(shouldshow) {
		if (shouldshow) {
			$(".control").stop().animate({'bottom':0}, 500);
			$(".caption").stop().animate({'top':0}, 500);
		} else {
			$(".control").stop().animate({'bottom':-50}, 500);
			$(".caption").stop().animate({'top':-50}, 500);
		}
	}

	var timeFormat = function(seconds) {
		var minite = Math.floor(seconds / 60);
		if (minite < 10) {
			minite = "0" + minite;
		}
		var second = Math.floor(seconds % 60);
		if (second < 10) {
			second = "0" + second;
		}
		return minite + ":" + second;
	}

	var playAndPause = function () {
		if (video[0].paused || video[0].ended) {
			video[0].play();
			$("#playBtn").removeClass('play').addClass('pause');
		} else {
			video[0].pause();
			$("#playBtn").removeClass('pause').addClass('play');
		}
	}

	var soundAndMete = () => {
		if(video[0].muted) {
	      video[0].muted = false;
	      $('#soundBtn').removeClass("mute").addClass("sound");
	      $('.volumeBar').css('width', video[0].volume * 100 + '%');
	    } else {
	      video[0].muted = true;
	      $('#soundBtn').removeClass("sound").addClass("mute");
	      $('.volumeBar').css('width', 0);
	    }
	}

	var stopVideo = function() {
		video[0].pause();
		updataProgress($(".progress").offset().left);
		$("#playBtn").removeClass('pause').addClass('play');
	}

	var enableProgressDrag = function() {
	    var progressDrag = false;
	    $('.progress').on('mousedown', function(e) {
	      progressDrag = true;
	      updataProgress(e.pageX);
	    });
	    $(document).on('mouseup', function(e) {
	      if(progressDrag) {
	        progressDrag = false;
	        updataProgress(e.pageX);
	      }
	    });
	    $(document).on('mousemove', function(e) {
	      if(progressDrag) {
	        updataProgress(e.pageX);
	      }
	    });
  };

	var updataProgress = function (x) {
		var progress = $(".progress");

		var percent = 100 * (x - progress.offset().left) / progress.width();
		if (percent > 100) {
			percent = 100;
		}
		if (percent < 0) {
			percent = 0;
		}
		$(".timeBar").css('width', percent + "%");
		video[0].currentTime = video[0].duration * percent / 100;
	}

	var enableSoundDrag = () => {
		let soundDrag = false;
		$(".volume").on("mousedown", (e) => {
			soundDrag = true;
			updataSound(e.pageX);
		});
		$(".volume").on("mouseup", (e) => {
			if (soundDrag) {
				soundDrag = false;
				updataSound(e.pageX);
			}
		});
		$(".volume").on("mousemove", (e) => {
			if (soundDrag) {
				updataSound(e.pageX);
			}
		});
	}

	var updataSound = (x) => {
		let volume = $(".volume");
		let percent = 100 * (x - volume.offset().left) / volume.width();
		if (percent > 100) {
			percent = 100;
		}
		if (percent < 0) {
			percent = 0;
		}
		$(".volumeBar").css('width', percent + "%");
		video[0].volume = percent / 100;
	}

	var speedUpdate = (speed) => {
		if (speed == 1) {
			$("#speed1Btn").addClass('selected');
			$("#speed3Btn").removeClass('selected');
		} else if (speed == 3) {
			$("#speed1Btn").removeClass('selected');
			$("#speed3Btn").addClass('selected');
		}
		video[0].playbackRate = speed;
	}

	video.on("loadedmetadata", function() {

		showTitleAndControl(false);

		$("#currentTime").html(timeFormat(video[0].currentTime));
		$("#duration").html(timeFormat(video[0].duration));

		$(".vContainer").hover(function() {
			showTitleAndControl(true);
		}, function() {
			showTitleAndControl(false);
		});

		$("#playBtn").on("click", playAndPause);
		$("#stopBtn").on("click", stopVideo);
		$("#speed1Btn").on("click", () => {
			speedUpdate(1);
		});
		$("#speed3Btn").on("click", () => {
			speedUpdate(3);
		});
		$("#soundBtn").on("click", soundAndMete);


		enableProgressDrag();
		enableSoundDrag();
	});

	video.on("timeupdate", function() {
		var currentTime = video[0].currentTime;
		var duration = video[0].duration;
		var percent = currentTime / duration * 100;
		$(".timeBar").css("width", percent + "%");
		$("#currentTime").html(timeFormat(currentTime));
	});

	video.on("canplay", function() {
		$(".loading").fadeOut(100);
	}); 
})(jQuery);

