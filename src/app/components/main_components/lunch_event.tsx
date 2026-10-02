export default function lunch_event() {
  const getWeekDates = () => {
    const today = new Date();

    const day = today.getDay(); // Sun = 0, Mon = 1 ... Sat = 6

    const monday = new Date(today);
    const diff = day === 0 ? -6 : 1 - day;

    monday.setDate(today.getDate() + diff);

    // Monday -> Sunday
    const week = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      return date;
    });

    return week;
  };

  const weekDates = getWeekDates();

  return (
    <div>
      <div
        style={{
          fontFamily: "'Big Shoulders Display', sans-serif",
          fontSize: "10rem",
          letterSpacing: "-0.01em",
          fontWeight: "bolder",
          textAlign: "center",
        }}
      >
        <span className="text-primary">B</span>
        <span className="text-foreground">D</span>
      </div>

      <div
        style={{
          textAlign: "center",
          fontFamily: "'Big Shoulders Display', sans-serif",
          fontSize: "2rem",
        }}
      >
        <span className="text-foreground">THIS WEEK</span>
        <br></br>
        <span className="text-foreground">LUNCH LIVE EVENT</span>
      </div>

      <div className="flex flex-row justify-center gap-5" style={{marginTop:"1rem",marginBottom:"1rem"}}>
        {weekDates.map((date) => (
          <div key={date.toISOString()}>
            <div
              style={{ border: "1px solid black" ,
                width:"30px",height:"30px",
                textAlign:"center",
                borderRadius:"100%",
                alignContent:"center",
                background:"#ABABAB",
                fontFamily: "'Big Shoulders Display', sans-serif",
                cursor:"pointer",
                fontWeight:"bolder",
                color:"#FFFFFF"
              }}
             
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
