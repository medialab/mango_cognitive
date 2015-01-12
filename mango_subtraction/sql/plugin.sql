CREATE TABLE IF NOT EXISTS `mango_subtraction` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `token` varchar(36) NOT NULL,
  `action` varchar(50) NOT NULL,
  `timestamp` varchar(50) NOT NULL,
  `iscorrect` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;