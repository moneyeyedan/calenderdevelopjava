/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 *
 * @author admin
 */
import java.util.*;
public class calander {
    public static void main(String arg[]){
       try{
           
        Scanner ooo=new Scanner(System.in);
        int monthcode[] = {0,3,3,6,1,4,6,2,5,0,3,5};
        int yearcode[]={6,4,2,0};
        int year,jj=0,limit=12,con=0;
        String monyr[]=new String[1];
        String monthname[]={"january","february","march","april","may","june","july","august","septamber","october","november","desember"};
        String monthyear=ooo.nextLine();
        monyr=monthyear.split(" ");
        if(monyr.length==2){
            year=Integer.parseInt(monyr[0]);
            for(String a:monthname){
                if(a.equals(monyr[1])){
                    jj=con;
                    limit=con+1;
                    break;
                }
                con=con+1;
            }
        }else{
             year=Integer.parseInt(monyr[0]);
             jj=0;
             limit=12;
        }
        int lasttwodigit=year%100;
        int leapcount=0;
        int monthend[];
	int code=0;
        if(year%4==0 && year%100!=0 || year%100==0 && year%400==0){
            monthend=new int[]{31,29,31,30,31,30,31,30,31,30,31,30};
	    code=1;
        }else{
             monthend=new int[]{31,28,31,30,31,30,31,30,31,30,31,30};
        }
        if(lasttwodigit!=0){
              leapcount=lasttwodigit/4;
        }
        int centure=year%400;
        if(centure>=100){
            centure=year/100;
        }else{
            centure=0;
        }
        for(int k=jj;k<limit;k++){
              int total=0;
              if(code==1){
                  total=(monthcode[k]+yearcode[centure]+leapcount+lasttwodigit)%7;
              }else{
                  total=(monthcode[k]+yearcode[centure]+leapcount+1+lasttwodigit)%7;
              }
              System.out.println(monthname[k]);
              System.out.println("SUN\tMON\tTUE\tWED\tTHES\tFRI\tSAT");
              int count=0;
              for(int i=0;i<monthend[k];i++){

                  for(int j=0;j<total;j++){
                      System.out.print("\t");
                      count=count+1;
                  }
                  System.out.print(i+1+"\t");
                  count=count+1;
                  if(count==7){
                      count=0;
                      System.out.println();
                  }
                  total=0;
              }
              System.out.println();
        }
      
      
       }
       catch(Exception  e){
           
       }
        
        
    }
    
}
