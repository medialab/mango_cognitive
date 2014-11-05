CREATE TABLE IF NOT EXISTS `mango_social_motivation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(35) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `screen_resolution` text,
  `window_resolution` text,
  `rewarded_line` text,
  `displayed_line` text,
  `user_answer` text,
  `rewarded_score` int(11) DEFAULT NULL,
  `is_rewarded` tinyint(1) DEFAULT NULL,
  `video_displayed` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  `delay_answer` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;