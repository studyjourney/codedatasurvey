CREATE TABLE `students` (
  `id` smallint PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE `assessments` (
  `id` smallint PRIMARY KEY AUTO_INCREMENT,
  `student_id` smallint,
  `module_short_code` varchar(30),
  `status` varchar(30),
  `style` varchar(30),
  `examination_forms` varchar(30),
  `proposal` varchar(65535),
  `grade` float,
  `protocol` varchar(65535),
  `internal_notes` varchar(65535),
  `external_notes` varchar(65535),
  `attempt` tinyint,
  `early_assessment_proposal` varchar(65535),
  `assessment_type` varchar(30),
  `project_lp_id` varchar(30),
  `semester_module_lp_id` varchar(30)
);

CREATE TABLE `students_projects` (
  `id` smallint PRIMARY KEY AUTO_INCREMENT,
  `student_id` smallint,
  `project_lp_id` varchar(30)
);

CREATE TABLE `fs20_modules` (
  `id` smallint PRIMARY KEY AUTO_INCREMENT,
  `student_id` smallint,
  `semester_module_lp_id` varchar(30)
);

CREATE TABLE `students_event_groups` (
  `id` smallint PRIMARY KEY AUTO_INCREMENT,
  `student_id` smallint,
  `event_group_lp_id` varchar(30)
);

ALTER TABLE `assessments` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

ALTER TABLE `students_projects` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

ALTER TABLE `fs20_modules` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

ALTER TABLE `students_event_groups` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);