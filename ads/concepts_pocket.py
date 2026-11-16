"""Pocket-snack concepts: the 8 oz bag that lives in a pocket, purse, backpack, carry-on or briefcase.

US audience, US settings, different people in every concept. Same shot format as concepts.py.
The bag is always described as a small matte kraft pouch with no label; branding is added as overlays.
"""

STYLE = ("Shot on a full-frame camera with a 35mm lens at f/2.8, natural colours, not oversaturated, "
         "gentle film grain, realistic skin texture, no text, no logos, no packaging labels.")

POUCH = "a small palm-sized 8-ounce matte kraft-paper snack pouch with a resealable zip top and no label"

MIX = ("a golden roasted snack mix of cornflakes, roasted peanuts, cashews, wheat checks, "
       "raisins and pita chips with a light red-chili dusting")
NUTS = "roasted peanuts, golden cashews and almonds with toasted coconut flakes"
HOT = ("dark-roasted peanuts and almonds with rice checks and pumpkin chips in a deep red chili coating")
PLAIN = "plain roasted peanuts and almonds with cornflakes, rice checks and raisins, no chili"
LIGHT = "an airy pale-golden mix of cornflakes, rice checks, flattened rice flakes, raisins and toasted coconut, no nuts"
EMBER = "golden roasted cashews and peanuts with cornflakes and pumpkin chips in a glossy deep-red chili glaze"


def _d(line):
    return f"(S1) <d>[English] {line}</d>"


POCKET = [
    {
        "id": "blazer_pocket",
        "product": "Everyday Medium",
        "genre": "business / before the meeting",
        "hook": "Fits in a blazer pocket. Beats the vending machine.",
        "music": "confident minimal house instrumental, crisp hi-hats, warm bass, polished and modern, 118 BPM",
        "cta": "Everyday Medium · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of an East Asian American woman in her late thirties in a navy blazer standing in a glass-walled office corridor in Chicago, slipping {POUCH} into the inside pocket of her blazer, a leather folio under her other arm, city light through the windows. Candid, documentary feel. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She tucks the pouch into her blazer pocket, pats it once, looks at the camera and says {_d('Board meeting at four. I come prepared.')} then walks off frame. Static camera.\noverall_soundscape: quiet office corridor, heels on polished floor, the soft crinkle of the pouch, her calm voice.\nnon_diegetic_music: N/A",
                "caption": "board meeting at four. prepared.",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's manicured hand pulling open the zip top of {POUCH} on a dark conference table, revealing {MIX} inside, a glass of water and a closed laptop beside it, soft daylight from a tall window. Shallow depth of field. {STYLE}",
                "video": "Her fingers pull the zip top open and tilt the pouch toward the camera so the mix is visible, then take a small pinch. Slow push-in. Sound: the crisp crinkle of the kraft pouch, a quiet conference room, a soft crunch.",
                "caption": "8 oz. roasted. no crumbs on the deck.",
            },
            {
                "image": f"A photograph, vertical, of the same East Asian American woman in the navy blazer standing by the window after the meeting, relaxed, eating a pinch of {MIX} from {POUCH} held in her other hand, a small satisfied smile, downtown Chicago soft behind the glass. {STYLE}",
                "video": "She eats the pinch, exhales with a small relieved smile and looks out of the window, the pouch held loosely at her side. Static camera. Sound: a quiet crunch, a soft exhale, muffled city hum through the glass.",
                "caption": "meeting survived.",
            },
        ],
    },
    {
        "id": "commute_train",
        "product": "The Nut Case",
        "genre": "commute / messenger bag",
        "hook": "Healthy commute snack. Doesn't crumble.",
        "music": "upbeat indie pop instrumental, jangly guitar, steady kick, optimistic morning energy, 112 BPM",
        "cta": "The Nut Case · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black man in his early thirties in a grey overcoat and headphones around his neck, seated on a morning commuter train into New York, pulling {POUCH} from the front pocket of a brown leather messenger bag on his lap, soft window light, blurred passengers behind. {STYLE}",
                "video": "He lifts the pouch out of the messenger bag pocket, gives it a little shake near his ear and smiles to himself. Static camera, gentle train sway. Sound: train rumble and rail clicks, the rattle of nuts in the pouch, a muffled station announcement.",
                "caption": "7:42 express. breakfast, sorted.",
            },
            {
                "image": f"A close-up photograph, vertical, of a man's hand tipping {NUTS} from {POUCH} into his open palm, the train window and passing city soft behind, warm low morning sun. Shallow depth of field. {STYLE}",
                "video": "The nuts pour from the pouch into his palm, a coconut flake drifting down, the city sliding past the window behind. Static camera. Sound: nuts tumbling onto skin, train rumble, a soft crunch.",
                "caption": "three nuts. no crumbs.",
            },
            {
                "image": f"A photograph, vertical, of the same Black man in the grey overcoat stepping off the train onto a busy platform, tossing a cashew into his mouth with one hand, the pouch tucked back in the messenger bag pocket, morning light and a blur of commuters. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He catches the cashew in his mouth, grins at the camera and says {_d('Pocket breakfast. Let us go.')} while walking. Slow tracking shot keeping pace with him.\noverall_soundscape: busy platform, footsteps, train doors, his upbeat voice.\nnon_diegetic_music: N/A",
                "caption": "pocket breakfast. let's go.",
            },
        ],
    },
    {
        "id": "carry_on",
        "product": "The Straight Shooter",
        "genre": "travel / airport security",
        "hook": "TSA-proof. Gate-ready. 8 ounces.",
        "music": "bright acoustic travel instrumental, ukulele and claps, light and airy, 105 BPM",
        "cta": "The Straight Shooter · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white woman in her forties in a camel coat at an airport security checkpoint in Atlanta, lifting her carry-on roller bag onto the conveyor, {POUCH} visible in the open outside pocket of the bag, grey plastic bins, bright terminal light. Documentary feel. {STYLE}",
                "video": "She pushes the carry-on onto the belt, taps the outside pocket where the pouch sits and gives the camera a knowing look. Static camera. Sound: airport terminal ambience, the roll of bins on the conveyor, a distant boarding announcement.",
                "caption": "no liquids. no problem.",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's hand taking {POUCH} out of the outside pocket of a carry-on bag at the gate, a boarding pass in the same hand, the airplane visible through the gate window behind, soft daylight. {STYLE}",
                "video": "She pulls the pouch from the carry-on pocket and opens the zip top, tilting it so the mix catches the light. Slow push-in. Sound: the crinkle of the pouch, gate-area chatter, a rolling suitcase passing.",
                "caption": "no chili. no fuss. no $14 airport snacks.",
            },
            {
                "image": f"A photograph, vertical, of the same woman in the camel coat in a window seat on the plane, relaxed, eating {PLAIN} from {POUCH} resting on the tray table, clouds outside the window, soft cabin light. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She takes a bite, looks at the camera and says {_d('Three hours. I am good.')} and turns back to the window. Static camera.\noverall_soundscape: steady cabin hum, a soft crunch, her relaxed voice.\nnon_diegetic_music: N/A",
                "caption": "three hours. I'm good.",
            },
        ],
    },
    {
        "id": "back_pocket",
        "product": "Extra Hot Trail",
        "genre": "college / skate",
        "hook": "Back-pocket snack. Actual heat.",
        "music": "lo-fi boom-bap instrumental with a dusty drum break and a bouncy bass line, 92 BPM",
        "cta": "Extra Hot Trail · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Latino college student in his early twenties in a plain black hoodie and loose jeans sitting on a concrete ledge at a skate plaza in Los Angeles, pulling {POUCH} out of the back pocket of his jeans, a skateboard under his feet, late golden light. {STYLE}",
                "video": "He pulls the pouch from his back pocket, flips it once in his hand and raises his eyebrows at the camera. Static camera. Sound: skateboard wheels rolling on concrete in the distance, the crinkle of the pouch, warm afternoon ambience.",
                "caption": "back pocket. always.",
            },
            {
                "image": f"A close-up photograph, vertical, of a young man's hand holding {POUCH} open to reveal {HOT}, deep red chili coating catching the golden light, a skateboard deck blurred below. Shallow depth of field. {STYLE}",
                "video": "He tips the pouch slightly so a few chili-coated almonds roll toward the opening, then takes a big pinch. Slow push-in. Sound: the crisp rustle of the mix, a crunch, distant skate wheels.",
                "caption": "real chili. not dust.",
            },
            {
                "image": f"A photograph, vertical, of the same Latino student mid-crunch, eyes slightly watering, a huge grin, giving a thumbs up with the hand not holding the pouch, skate plaza and palm trees soft behind in golden light. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He chews, blinks hard, laughs and says {_d('Okay. That one is actually hot.')} still grinning. Static camera.\noverall_soundscape: his laugh and voice, a crunch, skate wheels and birds in the distance.\nnon_diegetic_music: N/A",
                "caption": "okay, that one's actually hot.",
            },
        ],
    },
    {
        "id": "bottom_of_bag",
        "product": "Everyday Medium",
        "genre": "purse / running late",
        "hook": "The thing at the bottom of my bag that saves me.",
        "music": "playful indie instrumental with pizzicato strings and light percussion, 108 BPM",
        "cta": "Everyday Medium · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a South Asian American woman in her late twenties in a rust-coloured sweater standing at a bus stop in Seattle on an overcast day, digging through a large canvas tote bag, keys and a water bottle poking out, {POUCH} just visible inside. Candid street feel. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She rummages, finds the pouch, pulls it out triumphantly and says {_d('There you are.')} with a grin at the camera. Static camera.\noverall_soundscape: light street traffic, rustling bag contents, keys jingling, her relieved voice.\nnon_diegetic_music: N/A",
                "caption": "there you are.",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's hands opening {POUCH} over the open canvas tote, {MIX} visible inside the pouch, the soft grey Seattle light, a bus blurred behind. {STYLE}",
                "video": "She opens the zip top and takes a pinch, the tote hanging from her shoulder. Slow push-in. Sound: the crinkle of the pouch, a bus pulling up, a soft crunch.",
                "caption": "roasted. never fried. survives the tote.",
            },
            {
                "image": f"A photograph, vertical, of the same South Asian American woman sitting by the bus window, chewing happily, the pouch in her lap, raindrops on the glass, warm interior light against the grey outside. {STYLE}",
                "video": "She chews, leans her head against the window with a content smile and reseals the pouch with one hand. Static camera. Sound: bus engine hum, rain on the window, a soft crunch.",
                "caption": "lunch is far. this is close.",
            },
        ],
    },
    {
        "id": "jersey_pocket",
        "product": "The Nut Case",
        "genre": "cycling / endurance",
        "hook": "Jersey-pocket fuel that isn't a gel.",
        "music": "driving cinematic electronic instrumental, pulsing synths, building energy, 128 BPM",
        "cta": "The Nut Case · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white woman in her thirties in a plain teal cycling jersey and helmet, stopped at the top of a climb on a coastal road in Marin County, California, reaching back to pull {POUCH} from the rear pocket of her jersey, her road bike leaning against her hip, ocean haze behind. {STYLE}",
                "video": "She pulls the pouch from the rear jersey pocket, catches her breath and holds it up with a tired grin. Static camera. Sound: wind, a bike freewheel ticking, her breathing, the crinkle of the pouch.",
                "caption": "mile 38. real food.",
            },
            {
                "image": f"A close-up photograph, vertical, of a cyclist's gloved hand pouring {NUTS} from {POUCH} into the other palm, the sea and a winding road far below, bright coastal light. Shallow depth of field. {STYLE}",
                "video": "The nuts pour steadily into her palm until it is full, a coconut flake blowing away in the wind. Static camera. Sound: nuts on fabric and skin, wind, a distant gull.",
                "caption": "protein. salt. crunch. no gel.",
            },
            {
                "image": f"A photograph, vertical, of the same cyclist back on the bike rolling along the coastal road, chewing, the pouch tucked back into her jersey pocket, sun on the water behind her. {STYLE}",
                "video": "She rides toward the camera, chewing, and gives a quick two-finger salute before passing. Static camera. Sound: tyres on asphalt, wind, the whir of the drivetrain.",
                "caption": "back in the pocket. back on the road.",
            },
        ],
    },
    {
        "id": "minibar",
        "product": "Ember & Cashew",
        "genre": "business travel / hotel",
        "hook": "Skip the $9 minibar nuts.",
        "music": "late-night jazzy lo-fi instrumental, soft piano, brushed drums, 80 BPM",
        "cta": "Ember & Cashew · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black man in his forties in an unbuttoned white dress shirt in a dim hotel room in Dallas at night, laptop open on the desk, unzipping a black leather briefcase and pulling out {POUCH}, the minibar fridge open and glowing beside him. Moody warm lamp light. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He glances at the minibar, shakes his head, lifts the pouch out of the briefcase and says {_d('Nine dollars for a tiny can. No thank you.')} Static camera.\noverall_soundscape: quiet hotel room, the hum of the minibar fridge, the crinkle of the pouch, his dry voice.\nnon_diegetic_music: N/A",
                "caption": "nine dollars for a tiny can. no.",
            },
            {
                "image": f"A close-up photograph, vertical, of a man's hand pouring {EMBER} from {POUCH} into a white hotel coffee cup saucer on the desk, the laptop glow and a warm lamp, glossy red chili glaze catching the light. {STYLE}",
                "video": "He pours the glossy mix onto the saucer and picks up one cashew, turning it in the light. Slow push-in. Sound: the mix clattering onto porcelain, the hum of the room, a quiet crunch.",
                "caption": "sweet cashew. slow burn.",
            },
            {
                "image": f"A photograph, vertical, of the same man leaning back in the hotel desk chair, tie loosened, eating from the saucer with a satisfied look, the city lights of Dallas in the window behind him. {STYLE}",
                "video": "He chews slowly, raises his eyebrows in approval and taps the laptop closed with his other hand. Static camera. Sound: a crunch, the soft click of the laptop lid, distant city hum.",
                "caption": "lives in the briefcase. every trip.",
            },
        ],
    },
    {
        "id": "front_pocket",
        "product": "Featherweight",
        "genre": "school run / nut-free",
        "hook": "Front pocket. Nut-free. Done.",
        "music": "sunny acoustic pop instrumental, whistling melody, handclaps, 110 BPM",
        "cta": "Featherweight · nut-free · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white mother in her thirties in a grey hoodie at the front door of a suburban home in Ohio, early morning, zipping {POUCH} into the front pocket of a small blue kids' backpack held by a seven-year-old girl in a yellow raincoat. Soft morning light, a school bus blurred at the kerb. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] The mother zips the front pocket shut, taps it and says {_d('Front pocket. Nut-free. Go.')} and the girl runs toward the bus. Static camera.\noverall_soundscape: a school bus idling, birds, the zip, her brisk voice, small running footsteps.\nnon_diegetic_music: N/A",
                "caption": "front pocket. nut-free. go.",
            },
            {
                "image": f"A close-up photograph, vertical, of small hands opening {POUCH} to reveal {LIGHT}, pale golden flakes and coconut, on a school cafeteria table with a juice box beside it, bright window light. {STYLE}",
                "video": "The small hands open the zip top and take a pinch of the pale golden mix, a flake falling onto the table. Slow push-in. Sound: the crinkle of the pouch, cafeteria chatter, a light crunch.",
                "caption": "no nuts · no chili · no added salt",
            },
            {
                "image": f"A photograph, vertical, of the seven-year-old girl in the yellow raincoat at the cafeteria table, chewing with a big grin and holding up the almost-empty pouch toward the camera, classmates blurred behind. {STYLE}",
                "video": "She chews, holds the pouch upside down to show it is nearly empty and laughs. Static camera. Sound: her laugh, a crunch, cafeteria noise.",
                "caption": "the pocket that comes back empty.",
            },
        ],
    },
    {
        "id": "glovebox",
        "product": "Extra Hot Trail",
        "genre": "pickup truck / dad",
        "hook": "Glovebox snack that survives July.",
        "music": "warm Americana instrumental, slide guitar, steady acoustic strum, easy tempo, 96 BPM",
        "cta": "Extra Hot Trail · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white man in his fifties with a grey beard and a plain tan work shirt sitting in the driver's seat of a pickup truck parked at a hardware store lot in Nashville, reaching across to open the glovebox and pull out {POUCH}, hot midday light, dashboard and windshield glare. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He pops the glovebox, pulls out the pouch, looks at the camera and says {_d('Does not melt. Does not go stale. Does not run out before Friday.')} Static camera.\noverall_soundscape: the glovebox latch, the crinkle of the pouch, a truck engine ticking as it cools, his slow drawl.\nnon_diegetic_music: N/A",
                "caption": "doesn't melt. doesn't go stale.",
            },
            {
                "image": f"A close-up photograph, vertical, of a weathered man's hand holding {POUCH} open over the truck's centre console, {HOT} inside, deep red chili coating, a coffee thermos in the cup holder, hard sunlight through the windshield. {STYLE}",
                "video": "He takes a big pinch and lets a couple of chili almonds drop back into the pouch. Slow push-in. Sound: the crinkle of the pouch, the crunch of roasted nuts, a truck door closing somewhere in the lot.",
                "caption": "real heat. roasted, not fried.",
            },
            {
                "image": f"A photograph, vertical, of the same bearded man leaning on the open truck door, chewing, squinting into the sun with a small grin, the pouch in his shirt pocket now, the hardware store behind. {STYLE}",
                "video": "He chews, nods slowly in approval and pats the pouch in his shirt pocket. Static camera. Sound: a crunch, a passing car, cicadas.",
                "caption": "shirt pocket to glovebox to shirt pocket.",
            },
        ],
    },
    {
        "id": "scrubs_pocket",
        "product": "Everyday Medium",
        "genre": "healthcare / 12-hour shift",
        "hook": "12-hour shift. Pocket-sized backup.",
        "music": "gentle uplifting piano and soft pads instrumental, hopeful, 90 BPM",
        "cta": "Everyday Medium · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Filipino American nurse in her thirties in plain teal scrubs leaning against a wall in a quiet hospital corridor in Houston, pulling {POUCH} from the large hip pocket of her scrubs, a lanyard around her neck with the badge turned away, cool fluorescent light softened by a window. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She pulls the pouch from her scrubs pocket, exhales, looks at the camera and says {_d('Hour nine. Pocket backup.')} with a tired smile. Static camera.\noverall_soundscape: quiet corridor, a distant monitor beep, the crinkle of the pouch, her soft voice.\nnon_diegetic_music: N/A",
                "caption": "hour nine. pocket backup.",
            },
            {
                "image": f"A close-up photograph, vertical, of a nurse's hand taking a pinch of {MIX} from {POUCH} in a small break room, a paper cup of coffee and a vending machine blurred behind, soft overhead light. {STYLE}",
                "video": "She takes the pinch and tips the pouch slightly so the mix shifts toward the opening. Slow push-in. Sound: the crinkle of the pouch, the hum of the vending machine, a soft crunch.",
                "caption": "roasted. real food. not the vending machine.",
            },
            {
                "image": f"A photograph, vertical, of the same nurse walking back down the corridor, chewing, tucking the pouch back into her scrubs pocket with a small determined smile, soft window light ahead. {STYLE}",
                "video": "She tucks the pouch back into her pocket, squares her shoulders and walks toward the camera. Static camera. Sound: soft footsteps, a crunch, distant hospital ambience.",
                "caption": "three more hours. good.",
            },
        ],
    },
    {
        "id": "chairlift",
        "product": "Extra Hot Trail",
        "genre": "ski / chest pocket",
        "hook": "Chest-pocket snack with a kick.",
        "music": "crisp indie folk instrumental, banjo and stomping percussion, bright winter energy, 115 BPM",
        "cta": "Extra Hot Trail · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white man in his twenties in a plain burnt-orange ski jacket and goggles pushed up on his helmet, sitting on a chairlift in Colorado, unzipping the chest pocket of his jacket to pull out {POUCH}, snowy pines and bright blue sky below. {STYLE}",
                "video": "He unzips the chest pocket, pulls out the pouch and holds it up against the blue sky with a grin. Static camera, gentle chairlift sway. Sound: wind, the hum of the lift cable, the zip, the crinkle of the pouch.",
                "caption": "chest pocket. chairlift. go.",
            },
            {
                "image": f"A close-up photograph, vertical, of a gloved hand pouring {HOT} from {POUCH} into a bare palm, deep red chili coating vivid against the snow and bright light, ski slope soft below. {STYLE}",
                "video": "The chili-coated nuts pour into the bare palm, one bouncing off and falling toward the snow. Static camera. Sound: nuts on skin, wind, a distant whoop from the slope.",
                "caption": "warms you up from the inside.",
            },
            {
                "image": f"A photograph, vertical, of the same skier at the top of the lift, chewing, cheeks pink from the cold, giving an exaggerated 'whoa' face with steam on his breath, the pouch zipped back into his chest pocket, mountains behind. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He chews, his eyes widen, he laughs and says {_d('Oh, that is warm. Perfect.')} and pushes off down the slope. Static camera.\noverall_soundscape: wind, his laugh and voice, skis scraping snow.\nnon_diegetic_music: N/A",
                "caption": "oh, that's warm. perfect.",
            },
        ],
    },
    {
        "id": "stroller",
        "product": "Everyday Medium",
        "genre": "new parent / park",
        "hook": "Stroller-pocket snack. For the grown-up.",
        "music": "soft indie folk instrumental, fingerpicked guitar, warm and gentle, 95 BPM",
        "cta": "Everyday Medium · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Latina mother in her thirties in a plain olive jacket pushing a grey stroller through a park in Portland on a crisp morning, reaching into the stroller's handlebar organizer pocket to pull out {POUCH}, autumn leaves on the path, a coffee cup in the other holder. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She pulls the pouch from the stroller pocket, holds it up and says {_d('The baby has snacks. This one is mine.')} with a tired laugh. Slow tracking shot.\noverall_soundscape: stroller wheels on gravel, birds, leaves, her warm voice.\nnon_diegetic_music: N/A",
                "caption": "the baby has snacks. this one's mine.",
            },
            {
                "image": f"A close-up photograph, vertical, of a mother's hand opening {POUCH} to reveal {MIX}, the stroller handlebar and a coffee cup in the organizer pocket soft behind, autumn light. {STYLE}",
                "video": "She opens the pouch one-handed and takes a pinch while the stroller keeps rolling. Slow push-in. Sound: the crinkle of the pouch, stroller wheels on gravel, a soft crunch.",
                "caption": "one-handed. obviously.",
            },
            {
                "image": f"A photograph, vertical, of the same mother sitting on a park bench, stroller beside her, eyes closed in a brief moment of peace, chewing, the pouch in her lap, golden leaves falling. {STYLE}",
                "video": "She chews slowly, opens her eyes, glances at the stroller and smiles, then reseals the pouch. Static camera. Sound: a crunch, leaves rustling, a baby's soft babble.",
                "caption": "four minutes of peace. roasted.",
            },
        ],
    },
    {
        "id": "golf_bag",
        "product": "The Nut Case",
        "genre": "golf / back nine",
        "hook": "Back-nine snack. Lives in the golf bag.",
        "music": "breezy smooth jazz-funk instrumental, clean guitar, relaxed groove, 100 BPM",
        "cta": "The Nut Case · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black man in his fifties in a plain white polo and cap standing beside his golf bag on a cart at a sunny course in Scottsdale, Arizona, unzipping the side pocket of the bag and pulling out {POUCH}, desert hills and green fairway behind. {STYLE}",
                "video": "He unzips the side pocket, pulls out the pouch and shakes it once with a satisfied look toward the camera. Static camera. Sound: the zip, nuts rattling in the pouch, a distant golf swing, birds.",
                "caption": "twelfth hole. refuel.",
            },
            {
                "image": f"A close-up photograph, vertical, of a man's hand pouring {NUTS} from {POUCH} onto the cart's dashboard tray, a scorecard and pencil beside it, bright desert light. {STYLE}",
                "video": "He pours a small pile of nuts onto the tray and picks up an almond. Slow push-in. Sound: nuts clattering on plastic, a gentle breeze, a golf cart creaking.",
                "caption": "protein for the back nine.",
            },
            {
                "image": f"A photograph, vertical, of the same man in the white polo at the tee box, chewing, lining up a drive with a calm smile, the pouch tucked into his back pocket, fairway stretching behind. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He chews, steps up to the ball, glances at the camera and says {_d('Fueled. Watch this.')} then takes his stance. Static camera.\noverall_soundscape: birds, a light breeze, his confident voice, the tap of the club on the tee.\nnon_diegetic_music: N/A",
                "caption": "fueled. watch this.",
            },
        ],
    },
    {
        "id": "laptop_bag",
        "product": "Ember & Cashew",
        "genre": "remote work / coworking",
        "hook": "Lives in my laptop bag. Saves my afternoons.",
        "music": "chill electronic instrumental, soft plucks and a warm sub bass, focused, 100 BPM",
        "cta": "Ember & Cashew · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white woman in her late twenties with glasses in a plain cream sweater at a coworking space in Brooklyn, sliding {POUCH} out of the laptop sleeve of a black backpack next to her laptop, warm afternoon light through tall industrial windows. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She pulls the pouch from the laptop sleeve, looks at the camera and whispers {_d('Lives next to the charger. Priorities.')} Static camera.\noverall_soundscape: quiet coworking space, keyboard clicks, the crinkle of the pouch, her whisper.\nnon_diegetic_music: N/A",
                "caption": "lives next to the charger.",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's hand holding {POUCH} open beside a laptop keyboard, {EMBER} inside, glossy red glaze on golden cashews, a half-finished latte and a notebook on the wooden table. {STYLE}",
                "video": "She picks a cashew from the pouch and holds it up to the light before eating it. Slow push-in. Sound: the crinkle of the pouch, a soft crunch, quiet typing nearby.",
                "caption": "sweet cashew. slow burn. no crumbs in the keys.",
            },
            {
                "image": f"A photograph, vertical, of the same woman with glasses typing again, chewing with a focused half-smile, the pouch resting against the laptop, afternoon light across the desk. {STYLE}",
                "video": "She types, pauses, takes another pinch without looking away from the screen and keeps typing. Static camera. Sound: typing, a crunch, a quiet coworking hum.",
                "caption": "afternoon, saved.",
            },
        ],
    },
    {
        "id": "dog_walk",
        "product": "The Straight Shooter",
        "genre": "morning routine / dog",
        "hook": "One pocket for the treats. One for mine.",
        "music": "cheerful acoustic instrumental, light guitar and glockenspiel, morning freshness, 104 BPM",
        "cta": "The Straight Shooter · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a white man in his sixties in a plain navy quilted jacket walking a golden retriever on a tree-lined street in Minneapolis at sunrise, pulling {POUCH} from his jacket pocket while the dog looks up hopefully. Frost on the lawns, warm low sun. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] He pulls the pouch from his pocket, looks down at the dog and says {_d('No. This one is mine. Yours is the other pocket.')} The dog keeps staring. Static camera.\noverall_soundscape: birds at sunrise, the jingle of a dog collar, the crinkle of the pouch, his amused voice.\nnon_diegetic_music: N/A",
                "caption": "no. this one's mine.",
            },
            {
                "image": f"A close-up photograph, vertical, of an older man's hand holding {POUCH} open with {PLAIN} inside, a dog leash wrapped around the wrist, frosty sidewalk and low sun soft behind. {STYLE}",
                "video": "He takes a pinch from the pouch while the leash tugs gently at his wrist. Slow push-in. Sound: the crinkle of the pouch, a dog panting, birds.",
                "caption": "no chili. no fuss. all crunch.",
            },
            {
                "image": f"A photograph, vertical, of the same man and the golden retriever sitting on a park bench, the man chewing with a contented look and the dog leaning on his knee, the pouch resealed in his hand, sunrise light. {STYLE}",
                "video": "He chews, scratches the dog's head with his free hand and tucks the pouch back into his pocket. Static camera. Sound: a crunch, the dog's collar jingling, morning birds.",
                "caption": "same walk. better pocket.",
            },
        ],
    },
    {
        "id": "ride_share",
        "product": "Everyday Medium",
        "genre": "gig work / rideshare driver",
        "hook": "Door-pocket snack. 200 miles a day.",
        "music": "smooth neo-soul instrumental, mellow keys and a laid-back groove, 88 BPM",
        "cta": "Everyday Medium · 8 oz · ameei.in",
        "shots": [
            {
                "image": f"A photograph, vertical, of a Black woman in her forties in a plain burgundy cardigan sitting in the driver's seat of a clean sedan parked under a streetlight in Phoenix at dusk, pulling {POUCH} from the driver's door pocket, a phone mounted on the dash with the screen dark. {STYLE}",
                "video": f"integrated_multimodal_description: [Shot 1] She pulls the pouch from the door pocket, settles back and says {_d('Eleven rides. No drive-throughs.')} with a proud smile at the camera. Static camera.\noverall_soundscape: quiet car interior, a turn signal ticking, the crinkle of the pouch, her warm voice.\nnon_diegetic_music: N/A",
                "caption": "eleven rides. no drive-throughs.",
            },
            {
                "image": f"A close-up photograph, vertical, of a woman's hand taking a pinch of {MIX} from {POUCH} resting in the car's cup holder, dashboard glow and dusk light through the windshield. {STYLE}",
                "video": "She takes a pinch from the pouch in the cup holder and reseals it with a quick press. Slow push-in. Sound: the crinkle of the pouch, a soft crunch, distant traffic.",
                "caption": "roasted. one-handed. no grease on the wheel.",
            },
            {
                "image": f"A photograph, vertical, of the same woman in the burgundy cardigan chewing, checking her mirror with a relaxed smile, the pouch back in the door pocket, city lights beginning to glow outside. {STYLE}",
                "video": "She chews, glances at the mirror, taps the phone screen awake and pulls away from the kerb. Static camera. Sound: a crunch, the indicator, the engine starting.",
                "caption": "next ride. fueled.",
            },
        ],
    },
]
