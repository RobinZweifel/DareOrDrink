'use client';

import { useState } from 'react';
import GameScreen from './components/GameScreen';
import CategoryCard from './components/CategoryCard';
import { Beer, Home as HomeIcon, Palmtree, UtensilsCrossed, Plane, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'bar-club',
    name: 'Bar/Club Dares',
    challenges: [
      'Kiss a stranger on the cheek',
      'Take a shot off someone\'s body',
      'Whisper something dirty into a stranger\'s ear',
      'Exchange shirts with the person next to you',
      'Ask for a stranger\'s number using a bad pick-up line',
      'Order the weirdest cocktail on the menu',
      'Flash your phone screen with "I\'m single" to someone at the bar',
      'Touch someone\'s shoulder and say, "You\'re the one I\'ve been waiting for"',
      'Fake propose to someone you don\'t know',
      'Send a DM to your last crush on Instagram',
      'Dance seductively with a stranger for one song',
      'Get someone to buy you a drink without using words',
      'Start a conga line with at least 3 strangers',
      'Give someone your phone and let them post anything on your social media',
      'Ask the bartender for their most embarrassing customer story',
      'Create a fake dramatic scene with a stranger',
      'Get five strangers to take a group selfie with you',
      'Convince someone you\'re a famous person\'s sibling',
      'Get someone to teach you their best dance move',
      'Write your phone number on someone\'s arm',
      'Sing a karaoke song chosen by the group',
      'Get three strangers to toast with you',
      'Do body shots with someone you just met',
      'Start a dance-off with a stranger',
      'Get someone to give you their jacket/accessory for 5 minutes',
      'Ask someone to rate your pickup lines',
      'Get a stranger to teach you how to salsa dance',
      'Convince the DJ to give you a shoutout',
      'Get someone to share their most embarrassing club story',
      'Create a signature dance move and teach it to strangers'
    ]
  },
  {
    id: 'home-party',
    name: 'Home Party Dares',
    challenges: [
      'Make out with someone for 10 seconds',
      'Remove an item of clothing until your next turn',
      'Give someone a lap dance',
      'Text "I miss you" to your ex',
      'Share your last five Google searches with the group',
      'Eat something off someone else\'s body',
      'Get spanked by someone of your choice',
      'Show the group your sexiest selfie',
      'French kiss a piece of fruit',
      'Bite someone\'s ear softly',
      'Let someone draw something on your body with lipstick',
      'Give a sensual massage to someone for 2 minutes',
      'Let someone feed you something while blindfolded',
      'Do your best strip tease dance',
      'Play "seven minutes in heaven" with someone',
      'Let someone make you a mystery drink and you have to finish it',
      'Act out your favorite movie sex scene',
      'Let someone post a story on your Instagram',
      'Give someone a hickey',
      'Do body shots off someone\'s choice of body part',
      'Let someone style your hair however they want',
      'Demonstrate your best bedroom move',
      'Let someone write a text to anyone in your phone',
      'Do a sexy catwalk show',
      'Let someone give you a makeover',
      'Play truth or dare but only dares for 3 rounds',
      'Let someone pick your outfit from the clothes available',
      'Give a detailed description of your last dream',
      'Let someone browse your phone for 1 minute',
      'Do your best impression of someone in the room'
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant Dares',
    challenges: [
      'Seductively lick a utensil in front of everyone',
      'Moan while eating your food',
      'Feed someone a bite from your plate – with your mouth',
      'Drop ice cubes down your shirt or pants',
      'Flirt openly with the waiter',
      'Ask the table next to you to join your meal',
      'Make a toast announcing something embarrassing about yourself',
      'Fake an orgasm for 10 seconds',
      'Sit on someone\'s lap for the rest of the meal',
      'Text "WYD tonight?" to your last three matches on a dating app',
      'Ask for your food in a seductive voice',
      'Eat your entire meal without using hands',
      'Switch plates with a stranger',
      'Feed someone blindfolded',
      'Do a sexy dance to get the waiter\'s attention',
      'Write your number on the bill for the server',
      'Ask someone to share their dessert using only body language',
      'Pretend it\'s your birthday and demand attention',
      'Eat something in the most suggestive way possible',
      'Start a food fight with someone at your table',
      'Ask for someone else\'s leftovers',
      'Make up a sexy story about how you met your dining partner',
      'Get someone\'s phone number using only food puns',
      'Do a catwalk to the bathroom',
      'Trade an item of clothing with your dining partner',
      'Let someone order your entire meal',
      'Act out a dramatic breakup scene',
      'Propose to someone using a breadstick ring',
      'Start a singing flash mob in the restaurant',
      'Get the entire restaurant to toast with you'
    ]
  },
  {
    id: 'date-night',
    name: 'Date Night Dares',
    challenges: [
      'Feed each other dessert without using hands',
      'Slow dance in public for one full song',
      'Write a love note and hide it somewhere for your date to find',
      'Give each other sensual hand massages under the table',
      'Take a couples selfie in the most romantic spot you can find',
      'Whisper your favorite thing about each other in public',
      'Create a romantic scavenger hunt with 3 clues',
      'Recreate your first kiss',
      'Give each other three genuine compliments',
      'Share your most embarrassing dating story',
      'Do a couples yoga pose in public',
      'Write "I love you" using only body movements',
      'Serenade each other with a love song',
      'Play footsie throughout dinner',
      'Create a dance routine together',
      'Take turns feeding each other with chopsticks',
      'Make up a story about how you met (tell strangers)',
      'Give each other pet names and use them all night',
      'Draw portraits of each other blindfolded',
      'Play truth or dare but only romantic dares',
      'Take turns giving each other neck massages',
      'Share your first impressions of each other',
      'Act out how you\'d propose',
      'Write love poems for each other in 2 minutes',
      'Do the "Lady and the Tramp" spaghetti scene',
      'Slow dance in an elevator',
      'Leave secret admirer notes for each other',
      'Take artistic silhouette photos together',
      'Create a signature couple handshake',
      'Plan your dream honeymoon in 5 minutes'
    ]
  }
];

const categoryMetadata = {
  'bar-club': {
    icon: Beer,
    description: 'Spice up your night out with daring challenges',
    color: '#ef4444'  // red
  },
  'home-party': {
    icon: HomeIcon,
    description: 'Turn up the heat at your house party',
    color: '#3b82f6'  // blue
  },
  'outdoor': {
    icon: Palmtree,
    description: 'Take your adventures to the great outdoors',
    color: '#22c55e'  // green
  },
  'restaurant': {
    icon: UtensilsCrossed,
    description: 'Make dining out more exciting',
    color: '#f97316'  // orange
  },
  'vacation': {
    icon: Plane,
    description: 'Add some thrill to your travels',
    color: '#a855f7'  // purple
  },
  'date-night': {
    icon: Heart,
    description: 'Romantic challenges for couples',
    color: '#ec4899'  // pink
  }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<null | typeof categories[0]>(null);

  if (selectedCategory) {
    return <GameScreen category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <main className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#eff6fb' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Choose Your Adventure
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a category to start the game
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const metadata = categoryMetadata[category.id as keyof typeof categoryMetadata];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <CategoryCard
                  name={category.name}
                  description={metadata.description}
                  icon={metadata.icon}
                  color={metadata.color}
                  onClick={() => setSelectedCategory(category)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}