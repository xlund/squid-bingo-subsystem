# squid-bingo-subsystem
Programming solution for Krea. It's a working solution but not a perfect one. 

There are still optimisations to be made, some that I can think of currently:
- The game can cancel early if all boards have won, but there's still numbers left in the draw pile.
- The score can be calculated only for the needed board instead of all boards
- The last winner could be provided directly as the solution instead of looping through all boards and looking at the length of the winning sequence
