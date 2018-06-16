<template>
<div>
  <vue-code-diff id="codeDiffBlock" :old-string="oldCode" :new-string="newCode" :context="10"></vue-code-diff>
</div>
</template>

<script>
import vueCodeDiff from 'vue-code-diff'

export default {
  components: {
    vueCodeDiff
  },
  data() {
    return {
      oldCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner input=new Scanner (System.in);
        double a=input.nextDouble();
        double b=input.nextDouble();
        double c=input.nextDouble();
        double d=0;
        for(int i=1;i<=c;i++) {
        	d=a*(Math.pow(b+1, i));
        	System.out.print(i+" ");
        	System.out.printf("%.2f",d);
        	System.out.println();
        }

    }
}`,
      newCode: `import java.util.*;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner input = new Scanner(System.in);
		double P, R, N;
		P = input.nextDouble();
		R = input.nextDouble();
		N = input.nextDouble();
		double A;

		for (int i=1; i<=N; i++) {
			A = P*Math.pow(1+R, i);
			System.out.print(i+" ");
			System.out.printf("%.2f",A);
			System.out.println();
		}
	}

}
`
    }
  }
}
</script>

<style>
  /* #codeDiffBlock .hljs {
    border: 0px !important;
  } */
</style>
