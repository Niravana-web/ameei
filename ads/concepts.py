"""Ad concepts for ameei Instagram Reels (9:16, ~15 s, 3 shots).

Audience: US snackers first. Each concept = hook + 3 shots. Each shot has:
  image   : P-H3-Image prompt (photographer's description, portrait, no on-image text)
  video   : H3 FL2VA prompt (one action + camera + "Sound:" line, or structured dialogue)
  caption : on-screen text overlay for that shot (short)
  speak   : optional spoken line (voiced by H3; kept to one short sentence)
Product names/claims follow design-system/guidelines/voice.md.
"""

STYLE = ("Shot on a full-frame camera with a 35mm lens at f/2.8, natural colours, not oversaturated, "
         "gentle film grain, realistic skin texture, no text, no logos, no packaging labels.")

MIX = ("a golden roasted snack mix of cornflakes, roasted peanuts, cashews, wheat checks, "
       "raisins and pita chips with a light red-chili dusting")

CONCEPTS = [
    {
        "id": "desk_drawer",
        "product": "Everyday Medium",
        "genre": "office / 3pm slump",
        "hook": "Healthy 3pm snack. Not chips.",
        "music": "warm lo-fi hip hop instrumental, mellow Rhodes chords, soft vinyl crackle, laid-back drums, 85 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"A photograph by a documentary photographer of a Black woman in her early thirties at a bright open-plan office in Austin, Texas, wearing a sage green blouse, pulling open her desk drawer to reveal a small ceramic bowl full of {MIX}. Afternoon window light, a laptop and a cold brew on the desk, colleagues blurred in the background. Vertical framing from across the desk. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] The woman glances at the camera with a conspiratorial smile, lifts the bowl slightly out of the drawer and says (S1) <d>[English] Okay. This is my three p.m. secret.</d> Her other hand stays on the desk. Static camera, natural handheld feel.\noverall_soundscape: quiet office ambience, distant keyboard typing, the soft rattle of the snack mix in the bowl, her warm voice.\nnon_diegetic_music: N/A",
                "caption": "my 3pm secret",
            },
            {
                "image": f"A close-up photograph, vertical, of the same woman's hand lifting a generous handful of {MIX} from a small speckled ceramic bowl on a light wooden desk, cornflakes and peanuts catching the afternoon window light, a few flakes falling back into the bowl. Shallow depth of field, a laptop keyboard soft in the background. {STYLE}",
                "video": "Her hand slowly lifts the handful of snack mix toward the camera as a few cornflakes tumble back into the bowl. Slow push-in. Sound: the crisp rustle and crunch of the snack mix, a quiet office hum.",
                "caption": "roasted, never fried",
            },
            {
                "image": f"A photograph, vertical, of the same Black woman leaning back in her office chair, eyes closed in satisfaction, mid-crunch, holding the small ceramic bowl of {MIX} against her chest, warm afternoon light across her face, the office softly blurred behind. {STYLE}",
                "video": "She chews slowly with a satisfied smile, opens her eyes and gives a small approving nod toward the camera, keeping the bowl held against her chest. Static camera. Sound: a crunchy bite, a contented hum, quiet office ambience.",
                "caption": "a little bit of spice.",
            },
        ],
    },
    {
        "id": "gym_bag",
        "product": "The Nut Case",
        "genre": "fitness / protein",
        "hook": "High-protein. Roasted. Not a bar.",
        "music": "energetic indie electronic instrumental, punchy drums, bright synth bass, driving and upbeat, 120 BPM",
        "cta": "The Nut Case · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white man in his late twenties with a short beard, sweaty after a workout in a modern gym in Denver, sitting on a bench by the lockers in a grey tank top, unzipping a black gym bag and pulling out a small glass jar of roasted peanuts, cashews and almonds with toasted coconut flakes. Overhead gym lighting mixed with daylight from a high window, dumbbells blurred behind. {STYLE}",
                "video": "He pulls the jar fully out of the gym bag, holds it up and turns it slightly toward the camera with a tired grin. Static camera. Sound: the zip of the bag, nuts shifting in the jar, distant clank of weights, gym ambience.",
                "caption": "post-workout, no bar",
            },
            {
                "image": f"A macro photograph, vertical, of roasted peanuts, golden cashews and almonds with toasted coconut flakes pouring from a glass jar into a man's open palm, gym locker room with soft daylight behind, a water bottle out of focus. Shallow depth of field. {STYLE}",
                "video": "The nuts keep pouring slowly from the jar into his palm until it is full, a few coconut flakes drifting down. Static camera, slight slow push-in. Sound: nuts tumbling onto skin, a soft clatter, quiet locker room echo.",
                "caption": "all three nuts. high protein.",
            },
            {
                "image": f"A photograph, vertical, of the same bearded man standing by the gym exit door with his bag over his shoulder, tossing a handful of roasted nuts into his mouth, mid-laugh, bright daylight pouring in from the glass door, the city street outside blurred. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] He chews, swallows, looks at the camera and says (S1) <d>[English] Roasted, not fried. That's the whole trick.</d> His bag stays on his shoulder. Static camera.\noverall_soundscape: a crunchy bite, his relaxed voice, street traffic through the open door, gym ambience behind.\nnon_diegetic_music: N/A",
                "caption": "roasted, not fried",
            },
        ],
    },
    {
        "id": "road_trip",
        "product": "The Straight Shooter",
        "genre": "road trip / family",
        "hook": "The healthy road-trip snack kids finish",
        "music": "sunny indie folk instrumental, acoustic guitar strumming, hand claps, glockenspiel, feel-good, 105 BPM",
        "cta": "The Straight Shooter · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, from the passenger seat of a family SUV on a sunny interstate in Arizona, a Latina mother in her thirties driving in sunglasses, reaching back with one hand to pass a small paper cup of a golden roasted snack mix of peanuts, almonds, cornflakes, rice checks and raisins to a child in the back seat. Desert light through the windows, a highway stretching ahead. {STYLE}",
                "video": "The mother keeps her eyes on the road and passes the paper cup back; a small hand from the back seat takes it. Static camera mounted on the dashboard. Sound: tire hum on the highway, the rustle of the snack cup, a child's happy 'thanks mom'.",
                "caption": "no chili. no fuss.",
            },
            {
                "image": f"A photograph, vertical, of a seven-year-old Latino boy in a car seat, grinning with a mouthful, holding a paper cup of golden roasted snack mix of peanuts, almonds, cornflakes, rice checks and raisins, desert scenery blurred through the car window beside him, warm sunlight on his face. {STYLE}",
                "video": "The boy picks out a single cornflake, inspects it and pops it into his mouth, crunching happily, then peeks into the cup for the next one. Static camera. Sound: crunching, tire hum, muffled road noise, a giggle.",
                "caption": "no heat, all crunch",
            },
            {
                "image": f"A photograph, vertical, of the SUV parked at a scenic desert overlook at golden hour, the mother and boy sitting on the open tailgate sharing one small ceramic bowl of golden roasted snack mix between them, red rock mesas in the distance, warm low sunlight. {STYLE}",
                "video": "Both reach into the bowl at the same time, laugh, and the mother lets the boy go first. Slow push-in. Sound: gentle wind, distant birds, the rustle of the snack mix, shared laughter.",
                "caption": "the one the whole car agrees on",
            },
        ],
    },
    {
        "id": "movie_night",
        "product": "Everyday Medium",
        "genre": "cozy / couples",
        "hook": "Movie night snack. Roasted, not fried.",
        "music": "cozy neo-soul instrumental, warm electric piano, soft brushed drums, mellow bass, intimate, 78 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a young couple, an Asian-American woman and a white man in their late twenties, on a grey couch in a dim Brooklyn apartment lit by the glow of a TV off-frame and one warm floor lamp, a large wooden bowl of {MIX} between them on a blanket, both reaching in. {STYLE}",
                "video": "Both reach into the bowl, their hands bump, she laughs and nudges him away with her elbow. Static camera. Sound: the rustle of snack mix, a muffled movie soundtrack from the TV, her laugh.",
                "caption": "popcorn is retired",
            },
            {
                "image": f"A close-up photograph, vertical, of the wooden bowl of {MIX} on a knitted blanket, a hand scooping a big handful, warm lamplight from the side and cool TV glow from the front, shallow depth of field. {STYLE}",
                "video": "The hand scoops a generous handful and lifts it out of frame, a few peanuts rolling in the bowl. Static camera. Sound: a crisp crunchy rustle, muffled movie dialogue from the TV.",
                "caption": "peanuts · cashews · cornflakes · a little chili",
            },
            {
                "image": f"A photograph, vertical, of the Asian-American woman on the couch under the blanket, eyes on the TV off-frame, crunching with a delighted expression, the bowl in her lap, warm lamplight, her partner's shoulder soft in the foreground. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She crunches, pauses, turns to her partner and says (S1) <d>[English] Okay, where have these been all my life?</d> The bowl stays in her lap. Static camera.\noverall_soundscape: a crunchy bite, her amused voice, muffled movie sound from the TV, a soft laugh from her partner.\nnon_diegetic_music: N/A",
                "caption": "where have these been",
            },
        ],
    },
    {
        "id": "heat_challenge",
        "product": "Extra Hot Trail",
        "genre": "comedy / heat challenge",
        "hook": "Extra Hot Trail. Handle with respect.",
        "music": "dramatic trap-flavored instrumental with a comedic edge, deep 808s, tense strings, hi-hat rolls, 140 BPM",
        "cta": "Extra Hot Trail · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of two friends at a kitchen island in a Chicago apartment, a white man with red hair and a South Asian-American woman in a hoodie, facing a small black ceramic bowl of a dark-roasted peanut, almond, rice check and pumpkin chip snack mix heavily coated in deep red chili, both looking at it with mock seriousness, a glass of milk on the counter. Bright kitchen light. {STYLE}",
                "video": "The man cracks his knuckles and reaches slowly toward the bowl while the woman watches with a smirk, the glass of milk staying on the counter. Static camera. Sound: kitchen hum, a nervous exhale, her quiet snicker.",
                "caption": "he said he could handle it",
            },
            {
                "image": f"A close-up photograph, vertical, of the red-haired man's face mid-chew, eyebrows slightly raised in pleasant surprise, a calm closed-mouth smirk, natural pale freckled skin with no redness, a few chili-coated peanuts still in his hand, bright kitchen light, the woman blurred behind him grinning. {STYLE}",
                "video": "His eyes widen further, he exhales sharply through his mouth and fans his face with his free hand, keeping the peanuts in his other hand. Static camera. Sound: a sharp exhale, a muffled 'whoa', her laughter behind him.",
                "caption": "a long burn, not a flash",
            },
            {
                "image": f"A photograph, vertical, of the South Asian-American woman calmly eating a handful of the same chili-coated snack mix from the black bowl, completely unbothered, raising one eyebrow at the camera, the red-haired man gulping milk blurred behind her. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She chews calmly, shrugs at the camera and says (S1) <d>[English] Handle with respect.</d> She keeps holding the bowl. Static camera.\noverall_soundscape: her calm dry voice, a crunchy bite, the man gulping milk behind her, kitchen hum.\nnon_diegetic_music: N/A",
                "caption": "handle with respect",
            },
        ],
    },
    {
        "id": "lunchbox",
        "product": "Featherweight",
        "genre": "parents / nut-free",
        "hook": "Nut-free recipe. Lunchbox approved.",
        "music": "light playful ukulele pop instrumental, whistling melody, shaker, cheerful, 110 BPM",
        "cta": "Featherweight · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white father in his forties in a sunny suburban Ohio kitchen at 7am, packing a child's bento lunchbox, spooning an airy golden mix of cornflakes, wheat checks, rice checks, flattened rice flakes, raisins and toasted coconut flakes into one compartment, apple slices in another, a school backpack on the counter. Morning light. {STYLE}",
                "video": "He spoons the last of the mix into the lunchbox compartment and clicks the lid shut. Static camera, slight overhead angle. Sound: the soft rustle of cereal flakes, the click of the lunchbox lid, morning kitchen ambience, a radio murmuring.",
                "caption": "7am. lunchbox. done.",
            },
            {
                "image": f"A macro photograph, vertical, of the airy golden mix of cornflakes, wheat checks, rice checks, rice flakes, raisins and toasted coconut flakes in the lunchbox compartment, morning light raking across the flakes, the apple slices soft in the background. {STYLE}",
                "video": "A hand gently shakes the open lunchbox so the flakes settle, a few coconut flakes shifting on top. Slow push-in. Sound: the light papery rustle of cereal flakes, morning kitchen ambience.",
                "caption": "no nuts · no chili · no added salt",
            },
            {
                "image": f"A photograph, vertical, of a six-year-old girl with curly hair in a school cafeteria, grinning with cheeks full, holding up the open lunchbox toward the camera, other children blurred at long tables behind her, bright fluorescent and window light. {STYLE}",
                "video": "She grins wider, picks a cornflake from the lunchbox and crunches it, holding the box steady with the other hand. Static camera. Sound: cafeteria chatter, a crunch, a child's giggle.",
                "caption": "the compartment that comes back empty",
            },
        ],
    },
    {
        "id": "swap_the_chips",
        "product": "Everyday Medium",
        "genre": "grocery / swap",
        "hook": "Put the chips back. Snack healthy.",
        "music": "upbeat funk instrumental, slap bass, tight drums, wah guitar, horn stabs, confident, 112 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black man in his forties in a grocery store snack aisle in Atlanta, holding a generic unmarked silver bag of potato chips in one hand and looking at it with an unimpressed expression, shelves of colourful blurred snack bags behind him, fluorescent store light. {STYLE}",
                "video": "He looks at the chip bag, shakes his head slowly and puts it back on the shelf. Static camera. Sound: store ambience, the crinkle of the chip bag, a soft 'nah'.",
                "caption": "put the chips back",
            },
            {
                "image": f"A photograph, vertical, of the same man at home in his kitchen, pouring {MIX} from a plain kraft paper pouch with no label into a large white bowl, late afternoon light through the window, a football game glowing on a TV in the next room. {STYLE}",
                "video": "The mix pours steadily from the pouch into the bowl, filling it, then he sets the pouch down. Static camera. Sound: a cascading crunchy pour, the pouch crinkling, a muffled football crowd from the TV.",
                "caption": "roasted. spiced. not fried.",
            },
            {
                "image": f"A photograph, vertical, of the same man on his couch with the white bowl in his lap, one fist raised at the TV in celebration, a handful of snack mix in the other hand, warm lamplight, the game glowing on his face. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] He pumps his fist at the TV, turns to the camera and says (S1) <d>[English] Better than chips. Don't tell the chips.</d> The bowl stays in his lap. Static camera.\noverall_soundscape: a roaring football crowd from the TV, his warm laughing voice, snack mix rustling in the bowl.\nnon_diegetic_music: N/A",
                "caption": "real nuts. nothing artificial.",
            },
        ],
    },
    {
        "id": "trail",
        "product": "Extra Hot Trail",
        "genre": "outdoors / hiking",
        "hook": "Trail mix with an actual kick",
        "music": "cinematic acoustic instrumental, fingerpicked guitar, soft strings, open and airy, building, 95 BPM",
        "cta": "Extra Hot Trail · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Korean-American woman in her thirties in a red hiking jacket on a rocky ridge in Colorado, pausing with trekking poles, reaching into the top pocket of her backpack and pulling out a small reusable silicone pouch of a dark-roasted peanut, almond, rice check and pumpkin chip snack mix coated in red chili. Mountains and pine forest behind her, crisp morning light. {STYLE}",
                "video": "She pulls the pouch out, opens it and looks inside with a tired happy smile, poles leaning against her hip. Static camera. Sound: wind over the ridge, the pouch crinkling, distant birds, her breathing.",
                "caption": "mile 6. earned it.",
            },
            {
                "image": f"A close-up photograph, vertical, of the hiker's gloved hand holding a palmful of the chili-coated roasted peanuts, almonds, rice checks and pumpkin chips, a vast blurred mountain valley behind, sharp morning light. {STYLE}",
                "video": "She tips the palmful of snack mix slowly toward the camera, a chili flake catching the light, the valley staying still behind. Slow push-in. Sound: wind, the small crunchy shift of nuts in her palm.",
                "caption": "pumpkin chips · almonds · real chili",
            },
            {
                "image": f"A photograph, vertical, of the Korean-American hiker sitting on a boulder at the summit, crunching a mouthful with a wince-then-grin, a wide view of snowcapped peaks behind her, bright sun, her backpack beside her. {STYLE}",
                "video": "She crunches, winces at the heat, then breaks into a wide grin and looks out at the peaks, staying seated on the boulder. Static camera. Sound: a crunch, a sharp little exhale, a laugh, wind at the summit.",
                "caption": "a kick. literally.",
            },
        ],
    },
    {
        "id": "study_night",
        "product": "Ember & Cashew",
        "genre": "students / late night",
        "hook": "Study snack. Real cashews. Slow burn.",
        "music": "dark chill lo-fi instrumental, muted piano, deep sub bass, soft rain texture, focused, 80 BPM",
        "cta": "Ember & Cashew · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Latino college student in his early twenties in glasses and a university hoodie at a cluttered desk in a dorm room at 1am, lit by a single desk lamp and a laptop screen, textbooks open, one hand reaching into a small dark ceramic bowl of golden roasted cashews and peanuts with cornflakes and pumpkin chips in a glossy deep-red chili coating. {STYLE}",
                "video": "He keeps his eyes on the laptop and reaches blindly into the bowl, finds a cashew and eats it. Static camera. Sound: quiet typing, a crunch, the hum of the laptop fan, rain on the window.",
                "caption": "1am. chapter 9. cashews.",
            },
            {
                "image": f"A macro photograph, vertical, of the dark ceramic bowl of golden roasted cashews, peanuts, cornflakes and pumpkin chips in a glossy deep-red chili coating under the warm desk lamp, a pen and highlighter beside it, deep shadows. {STYLE}",
                "video": "A hand picks up one glossy chili-coated cashew and lifts it slowly toward the camera, the bowl staying still. Slow push-in. Sound: a soft rustle of nuts, rain on the window, a page turning.",
                "caption": "sweet cashew. slow burn.",
            },
            {
                "image": f"A photograph, vertical, of the same student leaning back in his chair, glasses pushed up, eyes wide awake after a bite, fanning his mouth slightly with a grin, the desk lamp lighting half his face, laptop glow on the other. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] He exhales, grins at the camera and says (S1) <d>[English] Yeah. I'm awake now.</d> He keeps leaning back in the chair. Static camera.\noverall_soundscape: his amused sleepy voice, a sharp exhale, rain on the window, laptop fan hum.\nnon_diegetic_music: N/A",
                "caption": "awake now.",
            },
        ],
    },
    {
        "id": "host_gift",
        "product": "The Nut Case",
        "genre": "gifting / dinner party",
        "hook": "Stop bringing wine. Bring this.",
        "music": "elegant jazzy bossa nova instrumental, nylon guitar, soft brushes, upright bass, warm and classy, 100 BPM",
        "cta": "The Nut Case · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a stylish Black woman in her thirties in a camel coat on the front porch of a Craftsman house in Portland at dusk, ringing the doorbell, holding a small glass jar of roasted peanuts, cashews and almonds with toasted coconut flakes tied with a simple saffron-yellow ribbon, warm porch light. {STYLE}",
                "video": "The door begins to open and she holds the jar up with a smile, the ribbon swaying slightly. Static camera. Sound: the doorbell chime, the door creaking open, muffled dinner-party chatter inside, her 'hi!'.",
                "caption": "the host gift that gets opened tonight",
            },
            {
                "image": f"A photograph, vertical, of a dinner party kitchen island with the glass jar of roasted peanuts, cashews, almonds and coconut flakes opened and tipped into a wooden bowl, several hands reaching in, wine glasses and candles around, warm overhead light. {STYLE}",
                "video": "Several hands reach into the wooden bowl at once, someone laughs, the candle flames flicker. Static camera. Sound: dinner-party chatter and laughter, clinking glasses, the rustle of nuts.",
                "caption": "all three nuts. gone in ten minutes.",
            },
            {
                "image": f"A photograph, vertical, of a white man in his forties, the host, in an apron, leaning on the island and eating a cashew with a surprised appreciative expression, looking at the guest off-frame, candlelight and warm kitchen light. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] He chews, points at the bowl and says (S1) <d>[English] Okay, you're invited back.</d> He keeps leaning on the island. Static camera.\noverall_soundscape: his warm amused voice, a crunch, dinner-party chatter and laughter around, glasses clinking.\nnon_diegetic_music: N/A",
                "caption": "you're invited back",
            },
        ],
    },
    {
        "id": "build_your_own",
        "product": "Build Your Own Mix",
        "genre": "studio / customization",
        "hook": "Build your own mix. Set your own heat.",
        "music": "bouncy modern pop instrumental, plucky synths, finger snaps, clean kick, playful, 118 BPM",
        "cta": "Build yours at ameei.in/studio",
        "shots": [
            {
                "image": f"A top-down photograph, vertical, of a light oak table in a sunny Seattle kitchen with eight small white ceramic bowls arranged in a grid, each holding one ingredient: roasted peanuts, cashews, almonds, cornflakes, rice checks, raisins, coconut flakes and dried red chilies, a pair of hands at the bottom edge hovering over them. Soft daylight. {STYLE}",
                "video": "The hands pick up the bowl of cashews and the bowl of dried chilies and lift them slightly, the other bowls staying in place. Static top-down camera. Sound: ceramic bowls sliding on wood, nuts shifting, quiet kitchen.",
                "caption": "pick your nuts. pick your heat.",
            },
            {
                "image": f"A photograph, vertical, of a white woman in her twenties with a blonde ponytail at the oak table, pouring cashews from a small bowl into a large glass mixing bowl already holding cornflakes and peanuts, concentrating with a slight smile, soft window light. {STYLE}",
                "video": "She pours the cashews in, then shakes the big glass bowl gently to mix everything together. Static camera. Sound: cashews clattering into the bowl, the crunchy shake of the mix, quiet kitchen.",
                "caption": "your mix. your rules.",
            },
            {
                "image": f"A photograph, vertical, of the same blonde woman holding the finished glass bowl of custom snack mix up toward the camera proudly, chili flakes visible on top, bright window light behind her. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She tilts the bowl toward the camera, grins and says (S1) <d>[English] Mine's medium. Don't judge.</d> She keeps holding the bowl with both hands. Static camera.\noverall_soundscape: her bright voice, the mix shifting in the glass bowl, quiet sunny kitchen.\nnon_diegetic_music: N/A",
                "caption": "mine's medium. don't judge.",
            },
        ],
    },
    {
        "id": "coffee_shop",
        "product": "Everyday Medium",
        "genre": "remote work / cafe",
        "hook": "Healthy pocket snack for the laptop life",
        "music": "breezy acoustic indie pop instrumental, bright guitar, soft claps, airy synth pad, 108 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a South Asian-American man in his thirties in a denim jacket at a window table of a busy San Francisco coffee shop, laptop open, pulling a small flat tin of {MIX} from his jacket pocket, a latte beside him, morning light and street blur through the window. {STYLE}",
                "video": "He slides the tin out of his pocket, pops the lid open and sets it beside the laptop. Static camera. Sound: cafe chatter, an espresso machine hissing, the click of the tin lid.",
                "caption": "pocket snack, unlocked",
            },
            {
                "image": f"A close-up photograph, vertical, of the open tin of {MIX} next to a laptop trackpad and a latte with heart latte art, the man's fingers picking up a cashew, soft window light, shallow depth of field. {STYLE}",
                "video": "The fingers lift the cashew out of the tin and away, then return for a cornflake. Static camera. Sound: a soft rustle, cafe ambience, a cup set down on a saucer.",
                "caption": "a handful between emails",
            },
            {
                "image": f"A photograph, vertical, of the same man crunching with a quiet satisfied smile while looking at his laptop screen, the tin and latte in the foreground, warm morning light on his face, cafe blurred behind. {STYLE}",
                "video": "He crunches, nods slightly to himself and keeps typing with one hand. Slow push-in. Sound: a crunch, soft typing, cafe murmur, a milk steamer in the distance.",
                "caption": "crunch with a little bit of spice",
            },
        ],
    },
    {
        "id": "tailgate",
        "product": "Extra Hot Trail",
        "genre": "sports / tailgate",
        "hook": "Tailgate snack. Roasted, not fried.",
        "music": "stadium rock instrumental, big drums, crunchy guitar riff, clapping, anthemic, 125 BPM",
        "cta": "Extra Hot Trail · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a group of friends in team jerseys at a stadium parking lot tailgate in Green Bay, a bearded white man in a knit hat pouring a dark-roasted peanut, almond, rice check and pumpkin chip snack mix coated in red chili from a plain kraft pouch into a big red plastic bowl on a folding table, a grill smoking behind, overcast cold light. {STYLE}",
                "video": "The mix pours into the bowl, he gives the pouch a final shake and sets it down. Static camera. Sound: the crunchy pour, a sizzling grill, crowd noise and a car stereo in the distance, cold wind.",
                "caption": "tailgate upgrade",
            },
            {
                "image": f"A photograph, vertical, of three friends' hands diving into the big red bowl of chili-coated roasted snack mix at once on the folding table, jerseys and beer cans around, a smoking grill soft behind. {STYLE}",
                "video": "The hands grab handfuls, one friend playfully slaps another's hand away, the bowl rocking slightly. Static camera. Sound: laughter, the rustle of the mix, a grill sizzling, distant crowd noise.",
                "caption": "roasted. spiced. no soggy chips.",
            },
            {
                "image": f"A photograph, vertical, of a Black woman in a team jersey and beanie at the tailgate, crunching a handful with a fired-up expression, pointing at the camera, stadium lights and a crowd blurred behind her. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She crunches, points at the camera and says (S1) <d>[English] Extra hot. Like the fourth quarter.</d> She keeps her other hand full of snack mix. Static camera, handheld feel.\noverall_soundscape: her hyped voice, a crunch, a cheering crowd nearby, a car stereo thumping.\nnon_diegetic_music: N/A",
                "caption": "extra hot. like the 4th quarter.",
            },
        ],
    },
    {
        "id": "airplane",
        "product": "The Straight Shooter",
        "genre": "travel",
        "hook": "Skip the pretzels. Bring real nuts.",
        "music": "dreamy ambient pop instrumental, soft pads, gentle piano, light percussion, calm and floating, 90 BPM",
        "cta": "The Straight Shooter · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white woman in her fifties with silver hair in a window seat of a commercial airplane, declining a tiny pretzel bag from a flight attendant's hand with a polite smile while holding up her own small flat tin of golden roasted peanuts, almonds, cornflakes, rice checks and raisins. Soft cabin light and bright window light. {STYLE}",
                "video": "She shakes her head politely at the pretzel bag and lifts her own tin a little higher with a knowing smile. Static camera. Sound: cabin engine hum, the crinkle of the pretzel bag, a soft 'no thank you'.",
                "caption": "no thanks, I'm good",
            },
            {
                "image": f"A close-up photograph, vertical, of the open flat tin of golden roasted peanuts, almonds, cornflakes, rice checks and raisins on an airplane tray table beside a plastic cup of ginger ale, clouds bright through the window, soft light. {STYLE}",
                "video": "Her hand lifts a few peanuts and cornflakes from the tin as the clouds drift slowly past the window. Static camera. Sound: engine hum, ice shifting in the cup, a soft rustle.",
                "caption": "roasted · no chili · no fuss",
            },
            {
                "image": f"A photograph, vertical, of the silver-haired woman crunching contentedly, looking out of the airplane window at bright clouds, the tin in her lap, soft daylight on her face. {STYLE}",
                "video": "She crunches slowly, smiles at the view and leans her head toward the window, the tin staying in her lap. Slow push-in. Sound: a crunch, engine hum, a quiet sigh of contentment.",
                "caption": "the seatmate everyone wants",
            },
        ],
    },
    {
        "id": "grandma_heritage",
        "product": "Everyday Medium",
        "genre": "heritage / story",
        "hook": "Her recipe. Roasted, never fried.",
        "music": "gentle emotional instrumental, soft piano, warm cello, subtle tabla heartbeat under it, nostalgic, 72 BPM",
        "cta": "From family recipes · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of an elderly Indian-American grandmother in a cotton saree in a sunlit New Jersey kitchen, stirring a wide steel kadai of roasting cornflakes, peanuts and curry leaves with a wooden spatula, steam and spice dust in the light, her granddaughter in her twenties watching beside her. Warm late-morning light. {STYLE}",
                "video": "The grandmother keeps stirring the kadai with slow steady turns while the granddaughter leans in to smell it. Static camera. Sound: the dry rustle of cornflakes in the pan, a gentle sizzle, curry leaves crackling, soft humming.",
                "caption": "her recipe, since forever",
            },
            {
                "image": f"A macro photograph, vertical, of the grandmother's hands sprinkling a pinch of red chili powder over the golden roasted mix in the steel kadai, spice dust hanging in the sunbeam, a worn steel spice box beside the stove. {STYLE}",
                "video": "Her fingers release the pinch of chili slowly, the red dust drifting down onto the mix. Slow push-in. Sound: a faint sizzle, the soft patter of spice landing, kitchen quiet.",
                "caption": "roasted, never fried",
            },
            {
                "image": f"A photograph, vertical, of the granddaughter in a modern apartment holding a small ceramic bowl of {MIX} up to the camera, smiling warmly, a framed photo of her grandmother soft on the shelf behind her, afternoon light. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She looks at the bowl, then at the camera, and says (S1) <d>[English] Same recipe. Now it ships.</d> She keeps holding the bowl with both hands. Static camera.\noverall_soundscape: her warm soft voice, a tiny rustle from the bowl, quiet apartment.\nnon_diegetic_music: N/A",
                "caption": "same recipe. now it ships.",
            },
        ],
    },
    {
        "id": "beer_pairing",
        "product": "Ember & Cashew",
        "genre": "bar / pairing",
        "hook": "Bar nuts, but roasted and real",
        "music": "laid-back blues rock instrumental, slide guitar, shuffle drums, warm bass, swagger, 96 BPM",
        "cta": "Ember & Cashew · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a wooden bar top in a dim Nashville taproom, a frosty pint of pale ale beside a small cast-iron dish of golden roasted cashews and peanuts with cornflakes and pumpkin chips in a glossy deep-red chili coating, a bartender with tattooed forearms placing the dish down, Edison bulbs glowing. {STYLE}",
                "video": "The bartender slides the cast-iron dish forward next to the pint and taps the bar twice. Static camera. Sound: the dish sliding on wood, two knocks on the bar, bar chatter, glasses clinking, a jukebox in the distance.",
                "caption": "the bar snack, upgraded",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's hand with dark nail polish lifting a glossy chili-coated cashew from the cast-iron dish, condensation sliding down the pint glass beside it, warm Edison bulb light. {STYLE}",
                "video": "The hand lifts the cashew slowly out of frame, condensation sliding down the pint glass. Static camera. Sound: a soft rustle, bar murmur, a glass set down nearby.",
                "caption": "sweet cashew. slow burn.",
            },
            {
                "image": f"A photograph, vertical, of a Latina woman in her thirties with dark lipstick at the bar, taking a sip of the pale ale right after a bite, eyes closed, a satisfied smile, Edison bulbs and bottles blurred behind her. {STYLE}",
                "video": "She sets the pint down, opens her eyes and gives the camera a slow approving nod, keeping one hand on the glass. Static camera. Sound: the glass landing on wood, a contented exhale, bar chatter.",
                "caption": "pairs with cold anything",
            },
        ],
    },
    {
        "id": "errands",
        "product": "Everyday Medium",
        "genre": "everyday / pocket snack",
        "hook": "Healthy pocket snack. 400-step day.",
        "music": "upbeat whistling indie instrumental, acoustic guitar, tambourine, bouncy bass, 115 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Latina woman in her forties in athleisure pushing a cart through a Target parking lot in suburban Dallas, bright midday sun, pulling a small flat tin of {MIX} from the pocket of her leggings, shopping bags in the cart. {STYLE}",
                "video": "She stops the cart, pulls the tin out of her pocket and flips the lid open with her thumb. Static camera. Sound: cart wheels on asphalt, a car door closing nearby, the click of the tin lid.",
                "caption": "errand fuel",
            },
            {
                "image": f"A close-up photograph, vertical, of the woman's hand tipping the open tin of {MIX} toward the camera, bright sun catching the cornflakes and chili dust, the parking lot blurred behind. {STYLE}",
                "video": "She tips the tin so the mix slides toward the edge, then catches a few pieces in her other palm. Static camera. Sound: the crunchy slide of the mix in the tin, traffic hum, birds.",
                "caption": "roasted, never fried",
            },
            {
                "image": f"A photograph, vertical, of the same woman leaning on her car in the sunny parking lot, crunching a mouthful and laughing at something off-camera, sunglasses pushed up, the tin in her hand. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She crunches, laughs and says to the camera (S1) <d>[English] Three more stops. I'm fine. I have snacks.</d> She keeps leaning on the car. Static camera.\noverall_soundscape: her cheerful voice, a crunch, parking-lot ambience, a shopping cart rattling past.\nnon_diegetic_music: N/A",
                "caption": "three more stops. I have snacks.",
            },
        ],
    },
    {
        "id": "macro_whats_inside",
        "product": "Everyday Medium",
        "genre": "product / ingredients",
        "hook": "What's actually in the bag",
        "music": "minimal modern instrumental, soft marimba, clean sub bass, light clicks, premium and clean, 100 BPM",
        "cta": "Everyday Medium · ameei.in",
        "shots": [
            {
                "image": f"An overhead macro photograph, vertical, of {MIX} spread in a thick layer across a light warm marble surface, every ingredient visible and sharp, soft diffused daylight, a few whole dried red chilies at the edge. {STYLE}",
                "video": "A wooden spoon slowly pushes through the layer of snack mix from the bottom of frame, turning the pieces over. Static top-down camera. Sound: the dry crunchy rustle of the mix moving on marble.",
                "caption": "peanuts · cashews · cornflakes · wheat checks · raisins · pita chips",
            },
            {
                "image": f"A macro photograph, vertical, of a single golden roasted peanut and a chili-dusted cornflake balanced on a fingertip, extremely shallow depth of field, soft warm daylight, the rest of the mix a golden blur behind. {STYLE}",
                "video": "The fingertip slowly rotates so the peanut and cornflake turn in the light. Static camera, macro. Sound: near silence, a soft room tone, a faint crackle.",
                "caption": "roasted slow. never fried.",
            },
            {
                "image": f"A photograph, vertical, of a handful of {MIX} being dropped from above into a speckled ceramic bowl on the marble surface, pieces frozen mid-fall, soft daylight. {STYLE}",
                "video": "The pieces finish falling into the bowl in a cascade, a few bouncing off the rim. Static camera. Sound: a cascading crunchy clatter into ceramic, then quiet.",
                "caption": "100% natural. no artificial anything.",
            },
        ],
    },
    {
        "id": "dad_bbq",
        "product": "The Nut Case",
        "genre": "backyard / summer",
        "hook": "Grill master's secret. Roasted. High protein.",
        "music": "sunny country-rock instrumental, twangy guitar, steady drums, harmonica, backyard summer, 110 BPM",
        "cta": "The Nut Case · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black father in his fifties in a 'kiss the cook' style plain apron at a smoking backyard grill in North Carolina, tongs in one hand, sneaking a handful of roasted peanuts, cashews and almonds with coconut flakes from a small bowl on the grill's side table, golden evening light, kids playing blurred in the yard. {STYLE}",
                "video": "He glances around to check nobody is watching, then quickly eats the handful of nuts and goes back to flipping the burgers. Static camera. Sound: a sizzling grill, kids laughing in the distance, a crunch, cicadas.",
                "caption": "the grill master's secret",
            },
            {
                "image": f"A close-up photograph, vertical, of the small bowl of roasted peanuts, golden cashews, almonds and toasted coconut flakes on the grill's side table, smoke drifting past, warm evening light, the tongs resting beside it. {STYLE}",
                "video": "A hand reaches in and grabs a big handful, a few almonds spilling onto the table, smoke drifting across. Static camera. Sound: the grill sizzling, nuts rattling, cicadas.",
                "caption": "all three nuts. high protein.",
            },
            {
                "image": f"A photograph, vertical, of a ten-year-old boy caught reaching for the same bowl of nuts, looking up at his father with a guilty grin, the father's apron in the foreground, warm evening light and grill smoke. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] The boy freezes with his hand in the bowl, grins and says (S1) <d>[English] I was just checking them for you.</d> Static camera.\noverall_soundscape: the boy's cheeky voice, the father's laugh off-camera, a sizzling grill, cicadas.\nnon_diegetic_music: N/A",
                "caption": "just checking them for you",
            },
        ],
    },
    {
        "id": "spice_lover",
        "product": "Extra Hot Trail",
        "genre": "hot-sauce people",
        "hook": "For people who carry hot sauce",
        "music": "fiery latin funk instrumental, congas, brass stabs, wah guitar, fast and hot, 128 BPM",
        "cta": "Extra Hot Trail · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white woman in her late twenties with a septum ring and a denim vest at a Los Angeles taco truck counter, pulling a small bottle of hot sauce out of her tote bag with one hand while holding a small paper cup of dark-roasted chili-coated peanuts, almonds, rice checks and pumpkin chips in the other, warm string lights, evening. {STYLE}",
                "video": "She sets the hot sauce bottle down on the counter, looks at the cup of snack mix instead and raises her eyebrows. Static camera. Sound: the bottle tapping the counter, a sizzling plancha, street chatter, a food-truck generator hum.",
                "caption": "she carries hot sauce. she didn't need it.",
            },
            {
                "image": f"A close-up photograph, vertical, of the paper cup of heavily chili-coated roasted peanuts, almonds, rice checks and pumpkin chips, the hot sauce bottle unopened beside it on the taco-truck counter, warm string lights bokeh. {STYLE}",
                "video": "Her fingers pick out a chili-crusted almond and lift it away; the hot sauce bottle stays untouched. Slow push-in. Sound: the rustle of the mix, a sizzling plancha, street ambience.",
                "caption": "cayenne · red chili · black pepper",
            },
            {
                "image": f"A photograph, vertical, of the same woman crunching a mouthful at the counter, eyes watering slightly, laughing and giving a thumbs up to the camera, string lights glowing behind her. {STYLE}",
                "video": "integrated_multimodal_description: [Shot 1] She crunches, her eyes water, she laughs and says (S1) <d>[English] Finally. Someone means it.</d> She keeps the thumbs up. Static camera, handheld feel.\noverall_soundscape: her laughing voice, a crunch, a sniff, street chatter and a sizzling plancha.\nnon_diegetic_music: N/A",
                "caption": "finally. someone means it.",
            },
        ],
    },
]

# Pocket-snack set (8 oz bag in a pocket / purse / carry-on / briefcase) — see concepts_pocket.py
from concepts_pocket import POCKET  # noqa: E402

CONCEPTS += POCKET
