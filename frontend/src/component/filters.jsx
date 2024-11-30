
import './filters.css'

function Filters({catagorys}){
    return(
        <>
  <input type="radio" id="Electronics" name="fav_language"className='cat' value="Electronics" onChange={catagorys}/><br />
  <input type="radio" id="Vehicle" name="fav_language" className='cat' value="Vehicle"  onChange={catagorys}/><br />
  <input type="radio" id="javascript" name="fav_language" className='cat' value="JavaScript"/><br />
        </>
        
    )
}

export default Filters