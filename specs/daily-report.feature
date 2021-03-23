Feature: Scrum Masters can observe the state of communication in their team in a daily report

  In order to observe the state of communication in my team
  As a Scrum master
  I want a daily report of activity in the Kanban board

  Scenario Outline: The report displays comments from the previous workday

    Given a comment previously posted on <creation day> but modified on <modification day>
    When Robert displays the daily report on the following <report day>
    Then he should <see?> the comment

    Examples: The report lists comments posted the previous workday
      | creation day | modification day | report day | see?    |
      | Monday       |                  | Tuesday    | see     |
      | Monday       |                  | Wednesday  | not see |
      | Friday       |                  | Monday     | see     |

    Examples: On a Monday, the report lists comments posted during the weekend
      | creation day | modification day | report day | see?    |
      | Friday       |                  | Monday     | see     |
      | Sunday       |                  | Monday     | see     |
      | Sunday       |                  | Tuesday    | not see |

    Examples: The report lists comments modified the previous workday
      | creation day | modification day | report day | see?    |
      | Monday       |                  | Wednesday  | not see |
      | Monday       | Tuesday          | Wednesday  | see     |
      | Thursday     | Saturday         | Monday     | see     |
