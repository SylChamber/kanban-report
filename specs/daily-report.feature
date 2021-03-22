Feature: Scrum Masters can observe the state of communication in their team in a daily report

  In order to observe the state of communication in my team
  As a Scrum master
  I want a daily report of activity in the Kanban board

  Scenario Outline: The report displays comments posted the previous workday

    Given those comments previously posted in the board
      | day       | member | card # |
      | Wednesday | John   | 1      |
      | Friday    | Esther | 2      |
      | Sunday    | Bill   | 3      |
      | Monday    | Julia  | 4      |
      | Tuesday   |        |        |
    When Robert displays the daily report on <day>
    Then he should see <comments>

    # day is in the range of days in the preceding table (Wednesday to Tuesday)

    Examples: The report lists comments posted the previous workday
      | day      | comments    |
      | Thursday | "John (#1)" |
      | Friday   | no comments |

    Examples: On a Monday, the report lists comments posted during the weekend
      | day     | comments                   |
      | Monday  | "Esther (#2)", "Bill (#3)" |
      | Tuesday | "Julia (#4)"               |
