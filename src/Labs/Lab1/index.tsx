export default function Lab1() {
    return (
      <div id="wd-lab1">
        <h2>Lab 1</h2>
        <h3>HTML Examples</h3>
        <div id="wd-h-tag">
        <h4>Table Tag</h4>
        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>HTML</td>
              <td>2/3/21</td>
              <td>85</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>CSS</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
                <td>Q3</td>
                <td>JavaScript</td>
                <td>2/17/21</td>
                <td>95</td>
            </tr>
            <tr>
                <td>Q4</td>
                <td>React</td>
                <td>2/24/21</td>
                <td>80</td>
            </tr>
            <tr>
                <td>Q5</td>
                <td>Node.js</td>
                <td>3/3/21</td>
                <td>85</td>
            </tr>
            <tr>
                <td>Q6</td>
                <td>Express</td>
                <td>3/10/21</td>
                <td>90</td>
            </tr>
            <tr>
                <td>Q7</td>
                <td>MongoDB</td>
                <td>3/17/21</td>
                <td>95</td>
            </tr>
            <tr>
                <td>Q8</td>
                <td>GraphQL</td>
                <td>3/24/21</td>
                <td>80</td>
            </tr>
            <tr>
                <td>Q9</td>
                <td>TypeScript</td>
                <td>3/31/21</td>
                <td>85</td>
            </tr>
            <tr>
                <td>Q10</td>
                <td>Redux</td>
                <td>4/7/21</td>
                <td>90</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Average</td>
              <td>85</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
);
}
  