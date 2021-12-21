import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

export const DIVISION_TYPES = [
  {
    text: 'WWU Students',
    value: 'wwu-students',
    wristBandColor: "Green",
    description: "All team members must be currently enrolled at WWU (undergrad or grad)."
  },
  {
    text: 'WWU Alumni',
    value: 'wwu-alumni',
    wristBandColor: "Blue",
    description: "At least half of team members must be WWU Alumni"
  },
  /*{
    text: 'Postsecondary Students',
    value: 'postsecondary',
    wristBandColor: "Purple",
    description: "All team members must be currently enrolled in college (undergrad or grad), technical school, or running start. Mix and match-team members from same or different schools."
  },
  */
  {
    text: 'Secondary Students',
    value: 'secondary',
    wristBandColor: "Red",
    description: "All team members must be currently enrolled in middle school or high school. Exception: One adult chaperone per team may register as a team member."
  },
  {
    text: 'Open',
    value: 'open',
    wristBandColor: "Orange",
    description: "General public, mixed student/non-student, family (participants under age 14 must have permission from parent/guardian)."
  },
];

export const WRIST_BAND_COLOR = function(){
  let map = {};
  DIVISION_TYPES.forEach(div => {
    map[div.value] = div.wristBandColor
  });
  return map;
}();

export const DIVISION_MAP = function(){
  map = {};
  DIVISION_TYPES.forEach(div => {
    map[div.value] = div.text
  });
  return map;
}();
