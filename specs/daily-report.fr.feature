Fonctionnalité: Les maîtres Scrum peuvent observer l'état de la communication dans leurs équipes par un rapport quotidien

  Afin d'observer l'état de la communication dans mon équipe
  En tant que maître Scrum
  Je veux un rapport quotidien d'activité dans le tableau Kanban

  Plan du scénario: Le rapport affiche les commentaires du jour ouvrable précédent

    Soit un commentaire publié précédemment le <jour de création> mais modifié le <jour de modification>
    Quand Robert affiche le rapport quotidien le <jour du rapport> suivant
    Alors il devrait <voir?> le commentaire

    Exemples: Le rapport liste les commentaires publiés le jour ouvrable précédent
      | jour de création | jour de modification | jour du rapport | voir?       |
      | lundi            |                      | mardi           | voir        |
      | lundi            |                      | mercredi        | ne pas voir |
      | vendredi         |                      | lundi           | voir        |

    Exemples: Le lundi, le rapport liste les commentaires publiés pendant le weekend
      | jour de création | jour de modification | jour du rapport | voir?       |
      | vendredi         |                      | lundi           | voir        |
      | dimanche         |                      | lundi           | voir        |
      | dimanche         |                      | mardi           | ne pas voir |

    Exemples: Le rapport liste les commentaires modifiés le jour ouvrable précédent
      | jour de création | jour de modification | jour du rapport | voir?       |
      | lundi            |                      | mercredi        | ne pas voir |
      | lundi            | mardi                | mercredi        | voir        |
      | jeudi            | samedi               | lundi           | voir        |
