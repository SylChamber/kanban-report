Fonctionnalité: Les maîtres Scrum peuvent observer l'état de la communication dans leurs équipes par un rapport quotidien

  Afin d'observer l'état de la communication dans mon équipe
  En tant que maître Scrum
  Je veux un rapport quotidien d'activité dans le tableau Kanban

  Plan du scénario: Le rapport affiche les commentaires publiés le jour ouvrable précédent

    Soit ces commentaires publiés précédemment dans le tableau
      | jour     | membre    | no carte |
      | mercredi | Jean      | 1        |
      | vendredi | Esther    | 2        |
      | dimanche | Guillaume | 3        |
      | lundi    | Julie     | 4        |
      | mardi    |           |          |
    Quand Robert affiche le rapport quotidien le <jour>
    Alors il devrait voir <commentaires>

    # jour est dans la plage de jours du tableau précédent (mercredi à mardi)

    Exemples: Le rapport liste les commentaires publiés le jour ouvrable précédent
      | jour     | commentaires      |
      | jeudi    | "Jean (no 1)"     |
      | vendredi | aucun commentaire |

    Exemples: Le lundi, le rapport liste les commentaires publiées pendant le weekend
      | jour  | commentaires                    |
      | lundi | "Esther (#2)", "Guillaume (#3)" |
      | mardi | "Julie (#4)"                    |
