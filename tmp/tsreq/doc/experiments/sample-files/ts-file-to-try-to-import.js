"use strict";
exports.testExport = 'Export successful!';
var Sex;
(function (Sex) {
    Sex[Sex["Male"] = 0] = "Male";
    Sex[Sex["Female"] = 1] = "Female";
})(Sex || (Sex = {}));
var GreetingMood;
(function (GreetingMood) {
    GreetingMood[GreetingMood["Positive"] = 0] = "Positive";
    GreetingMood[GreetingMood["Neutral"] = 1] = "Neutral";
    GreetingMood[GreetingMood["Negative"] = 2] = "Negative";
})(GreetingMood || (GreetingMood = {}));
exports.sayHello = function (name, sex, mood) {
    switch (mood) {
        case GreetingMood.Positive:
            return "Top of the morning to you, " + name + " my good " + ((sex === Sex.Male) ? 'sir' : 'madam');
        case GreetingMood.Negative:
            return "Well look what the cat dragged in. Glad " + name + " is here, I was starting to" +
                "worry I might actually enjoy my day.";
        default:
        case GreetingMood.Neutral:
            return "Hello " + name;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHMtZmlsZS10by10cnktdG8taW1wb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZG9jL2V4cGVyaW1lbnRzL3NhbXBsZS1maWxlcy90cy1maWxlLXRvLXRyeS10by1pbXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFhLFFBQUEsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRS9DLElBQUssR0FHSjtBQUhELFdBQUssR0FBRztJQUNOLDZCQUFJLENBQUE7SUFDSixpQ0FBTSxDQUFBO0FBQ1IsQ0FBQyxFQUhJLEdBQUcsS0FBSCxHQUFHLFFBR1A7QUFFRCxJQUFLLFlBSUo7QUFKRCxXQUFLLFlBQVk7SUFDYix1REFBUSxDQUFBO0lBQ1IscURBQU8sQ0FBQTtJQUNQLHVEQUFRLENBQUE7QUFDWixDQUFDLEVBSkksWUFBWSxLQUFaLFlBQVksUUFJaEI7QUFFWSxRQUFBLFFBQVEsR0FBRyxVQUFDLElBQVksRUFBRSxHQUFRLEVBQUUsSUFBa0I7SUFDL0QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNYLEtBQUssWUFBWSxDQUFDLFFBQVE7WUFDdEIsTUFBTSxDQUFDLGdDQUE4QixJQUFJLGtCQUNyQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FDdEMsQ0FBQztRQUNQLEtBQUssWUFBWSxDQUFDLFFBQVE7WUFDdEIsTUFBTSxDQUFDLDZDQUEyQyxJQUFJLGdDQUE2QjtnQkFDM0Usc0NBQXNDLENBQUM7UUFDbkQsUUFBUTtRQUFDLEtBQUssWUFBWSxDQUFDLE9BQU87WUFDOUIsTUFBTSxDQUFDLFdBQVMsSUFBTSxDQUFDO0lBQy9CLENBQUM7QUFDTCxDQUFDLENBQUMifQ==