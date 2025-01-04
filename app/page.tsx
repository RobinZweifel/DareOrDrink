'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import GameScreen from './components/GameScreen';

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
    id: 'outdoor',
    name: 'Outdoor Dares',
    challenges: [
      'Kiss someone in the group in front of strangers',
      'Swim in your underwear',
      'Flash someone in the group for 5 seconds',
      'Run to the nearest stranger and say, "I love you"',
      'Play "spin the bottle" with random beach items',
      'Write a dirty word in the sand',
      'Give someone a back massage while shirtless',
      'Lick a friend\'s neck',
      'Pretend to seduce a tree',
      'Take a dare from a stranger',
      'Do a sexy dance in public',
      'Take a suggestive photo with a statue',
      'Ask a stranger to rate your attractiveness',
      'Give someone a piggyback ride for 2 minutes',
      'Start a water fight with someone',
      'Do your best Baywatch run',
      'Make out with someone in the ocean',
      'Create a human pyramid with strangers',
      'Do a body shot off someone in public',
      'Start a flash mob dance',
      'Take a sexy photo with a random object',
      'Play leapfrog with strangers',
      'Give someone a shoulder massage in public',
      'Do a handstand while someone holds your legs',
      'Start a game of tag with random people',
      'Do your best mermaid/merman pose',
      'Create a human chain with strangers',
      'Play chicken fight with someone',
      'Do a trust fall with a stranger',
      'Start a conga line on the beach'
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
    id: 'vacation',
    name: 'Vacation/Travel Dares',
    challenges: [
      'Take a photo pretending to kiss a stranger',
      'Whisper, "You\'re gorgeous" to someone in a foreign language',
      'Dance seductively in a public spot',
      'Flash your underwear for a quick photo',
      'Hug a stranger and don\'t let go for 10 seconds',
      'Swap a piece of clothing with someone in the group',
      'Pretend to be a couple with someone in the group and convince a stranger',
      'Try to join a stranger\'s conversation',
      'Kiss someone on the forehead – stranger or not',
      'Buy a stranger a drink and ask if they want to "hang out"',
      'Get a stranger to teach you a local pickup line',
      'Do a sexy photoshoot with a local landmark',
      'Start a pool party with strangers',
      'Get someone to apply sunscreen on your back seductively',
      'Create a vacation romance story with a stranger',
      'Do a striptease with a local souvenir',
      'Get someone to teach you a "local tradition" you made up',
      'Take a sensual yoga pose in a public place',
      'Get a stranger to rate your accent',
      'Do a sexy walk down the beach',
      'Get someone to feed you local food',
      'Create a romantic scene in front of a sunset',
      'Get three strangers to join your "bachelor/bachelorette" party',
      'Do a seductive dance with local music',
      'Get someone to write something flirty on your body',
      'Start a beach volleyball game with strangers',
      'Get someone to teach you a "traditional" dance you made up',
      'Take a "couple photo" with a stranger',
      'Get someone to join your fake music video',
      'Create a flash mob at a tourist spot'
    ]
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<null | typeof categories[0]>(null);

  if (selectedCategory) {
    return <GameScreen category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <main className="min-h-screen p-4" style={{ backgroundColor: '#eff6fb' }}>
      <h1 className="text-4xl font-bold text-center mb-8">Choose a Category</h1>
      <div className="max-w-md mx-auto space-y-4">
        {categories.map(category => (
          <Card
            key={category.id}
            className="p-4 cursor-pointer hover:bg-accent"
            onClick={() => setSelectedCategory(category)}
          >
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {category.challenges.length} dares
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}