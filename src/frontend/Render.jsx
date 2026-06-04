import React from 'react';
import { useEffect } from 'react';
export function Render(){
    const checkAdmin = async () => {
        const response = await fetch("http://localhost:5000/admin/check-admin");
        const data = await response.json();
        console.log(data);
    }
       useEffect(() => {

      checkAdmin();

   }, []);

  return (
    <div>
    </div>
  );
}
