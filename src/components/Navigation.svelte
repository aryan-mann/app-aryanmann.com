<script>
	import { SiteData } from '../site.ts';
	import LogoBlack from "@assets/images/am_logo_black.png"

</script>

<div class="flex flex-col items-center justify-center pb-12">
	<img
		alt="logo with the words Aryan Mann"
		src={LogoBlack}
		width={170}
		height={72}
	/>
	<div class="flex flex-wrap pt-8 md:pt-12 gap-4 justify-center">
		{#each SiteData.menuLinks as menuLink}
			<a class="thick-link" href={menuLink.url}>{menuLink.label}</a>
		{/each}
	</div>
</div>
