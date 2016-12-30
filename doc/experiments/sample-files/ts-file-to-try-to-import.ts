export const testExport = 'Export successful!';

enum Sex {
  Male,
  Female
}

enum GreetingMood {
    Positive,
    Neutral,
    Negative
}

export const sayHello = (name: string, sex: Sex, mood: GreetingMood) => {
    switch (mood) {
        case GreetingMood.Positive:
            return `Top of the morning to you, ${name} my good ${
                (sex === Sex.Male) ? 'sir' : 'madam'
            }`;
        case GreetingMood.Negative:
            return `Well look what the cat dragged in. Glad ${name} is here, I was starting to` +
                    `worry I might actually enjoy my day.`;
        default: case GreetingMood.Neutral:
            return `Hello ${name}`;
    }
};
