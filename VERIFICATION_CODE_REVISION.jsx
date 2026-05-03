{/* REVISED VERIFICATION CODE SECTION WITH EMAIL NOTE & STATE HANDLING */}

{/* EMAIL VERIFICATION NOTE */}
<div className="self-stretch pl-1 pr-2.5 py-1 bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-Gold-with-Opacity-20/20 inline-flex justify-start items-start gap-2">
  <div data-color="Brand" data-size="sm" data-theme="Light" className="w-8 h-8 relative rounded-2xl">
    <div className="w-4 h-4 left-[8px] top-[8px] absolute overflow-hidden">
      <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-Color-Gold-(Brand-Color)-500---Primary-Brand" />
    </div>
  </div>
  <div className="flex justify-start items-center gap-1">
    <div className="justify-start">
      <span className="text-Color-Gold-(Brand-Color)-500---Primary-Brand text-xs font-semibold font-['Inter'] leading-4">Email Verification Required</span>
      <span className="text-Color-Gold-(Brand-Color)-400---Bright-Accent text-xs font-normal font-['Inter'] leading-4"> — Please check your email address for verification instructions. Your email will be updated once verified.</span>
    </div>
  </div>
</div>

{/* VERIFICATION CODE INPUT SECTION */}
<div className="self-stretch inline-flex justify-center items-end gap-3 overflow-hidden">
  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
      
      {/* TITLE & DESCRIPTION */}
      <div className="flex flex-col justify-start items-start gap-0.5">
        <div className="inline-flex justify-center items-center gap-0.5">
          <div className="justify-start text-Color-White text-sm font-semibold font-['Inter'] leading-5">Enter Verification Code</div>
          <div className="justify-start text-Colors-Text-text-error-primary-(600) text-sm font-medium font-['Inter'] leading-5">*</div>
        </div>
        <div className="w-80 justify-start text-Color-Gray-500---Tertiary-Text-Footer text-sm font-normal font-['Figtree'] leading-5">We've sent a 6-digit verification code to your email. Enter it below to confirm your new email address.</div>
      </div>

      {/* VERIFICATION CODE INPUT - DEFAULT STATE (Placeholder) */}
      <div data-state="default" className="self-stretch inline-flex justify-start items-start gap-2.5">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="inline-flex justify-start items-center gap-1.5">
              {/* CODE DIGIT 1 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
              {/* CODE DIGIT 2 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
              {/* CODE DIGIT 3 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
              {/* SEPARATOR */}
              <div className="w-5 h-11 text-center justify-center text-Neutral-Default text-4xl font-medium font-['Inter'] leading-[49.50px]">-</div>
              {/* CODE DIGIT 4 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
              {/* CODE DIGIT 5 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
              {/* CODE DIGIT 6 */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Black-with-Opacity-10/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Opacity-Scales-(For-Overlays-&-Borders)-White-with-Opacity-10/10 inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden hover:outline-Color-Gold-(Brand-Color)-500---Primary-Brand/50 transition-all">
                <div className="self-stretch text-center justify-start text-Color-Gray-700 text-2xl font-extrabold font-['Inter'] leading-8">0</div>
              </div>
            </div>
          </div>
        </div>
        {/* VERIFY BUTTON - DEFAULT */}
        <div className="flex-1 h-11 px-4 py-2.5 bg-Color-Opacity-Scales-(For-Overlays-&-Borders)-Gold-with-Opacity-10/10 rounded-xl shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-Color-Gold-(Brand-Color)-500---Primary-Brand flex justify-center items-center gap-1.5 overflow-hidden hover:bg-Color-Gold-(Brand-Color)-500---Primary-Brand/20 transition-all cursor-pointer">
          <div className="px-0.5 flex justify-center items-center">
            <div className="justify-start text-Color-Gold-(Brand-Color)-500---Primary-Brand text-base font-semibold font-['Inter'] leading-6">Verify</div>
          </div>
        </div>
      </div>

      {/* VERIFICATION CODE INPUT - ERROR STATE (Wrong Code) */}
      <div data-state="error" className="self-stretch inline-flex justify-start items-start gap-2.5 hidden">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="inline-flex justify-start items-center gap-1.5">
              {/* CODE DIGIT 1 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">1</div>
              </div>
              {/* CODE DIGIT 2 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">2</div>
              </div>
              {/* CODE DIGIT 3 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">3</div>
              </div>
              {/* SEPARATOR */}
              <div className="w-5 h-11 text-center justify-center text-Neutral-Default text-4xl font-medium font-['Inter'] leading-[49.50px]">-</div>
              {/* CODE DIGIT 4 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">4</div>
              </div>
              {/* CODE DIGIT 5 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">5</div>
              </div>
              {/* CODE DIGIT 6 - ERROR */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Colors-Text-text-error-primary-(600)/10 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Colors-Text-text-error-primary-(600) inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Colors-Text-text-error-primary-(600) text-2xl font-extrabold font-['Inter'] leading-8">6</div>
              </div>
            </div>
          </div>
        </div>
        {/* VERIFY BUTTON - ERROR STATE */}
        <div className="flex-1 h-11 px-4 py-2.5 bg-Colors-Text-text-error-primary-(600)/20 rounded-xl shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-Colors-Text-text-error-primary-(600) flex justify-center items-center gap-1.5 overflow-hidden transition-all">
          <div className="px-0.5 flex justify-center items-center">
            <div className="justify-start text-Colors-Text-text-error-primary-(600) text-base font-semibold font-['Inter'] leading-6">Try Again</div>
          </div>
        </div>
      </div>

      {/* VERIFICATION CODE INPUT - SUCCESS STATE (Correct Code) */}
      <div data-state="success" className="self-stretch inline-flex justify-start items-start gap-2.5 hidden">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="inline-flex justify-start items-center gap-1.5">
              {/* CODE DIGIT 1 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">1</div>
              </div>
              {/* CODE DIGIT 2 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">2</div>
              </div>
              {/* CODE DIGIT 3 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">3</div>
              </div>
              {/* SEPARATOR */}
              <div className="w-5 h-11 text-center justify-center text-Neutral-Default text-4xl font-medium font-['Inter'] leading-[49.50px]">-</div>
              {/* CODE DIGIT 4 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">4</div>
              </div>
              {/* CODE DIGIT 5 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">5</div>
              </div>
              {/* CODE DIGIT 6 - SUCCESS */}
              <div className="w-11 min-h-11 px-1.5 py-[1.38px] bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-md shadow-[0px_0.6875px_1.375px_0px_rgba(16,24,40,0.05)] outline outline-[0.69px] outline-offset-[-0.69px] outline-Color-Semantic-Colors-Success-2-500---Success-Light inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden transition-all">
                <div className="self-stretch text-center justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-2xl font-extrabold font-['Inter'] leading-8">6</div>
              </div>
            </div>
          </div>
        </div>
        {/* VERIFY BUTTON - SUCCESS STATE */}
        <div className="flex-1 h-11 px-4 py-2.5 bg-Color-Semantic-Colors-Success-2-500---Success-Light/20 rounded-xl shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-Color-Semantic-Colors-Success-2-500---Success-Light flex justify-center items-center gap-1.5 overflow-hidden transition-all">
          <div className="px-0.5 flex justify-center items-center">
            <div className="justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-base font-semibold font-['Inter'] leading-6">Verified ✓</div>
          </div>
        </div>
      </div>

      {/* HELPER TEXT - DEFAULT */}
      <div data-state="default" className="w-80 justify-start text-Color-Gray-500---Tertiary-Text-Footer text-sm font-normal font-['Figtree'] leading-5">
        Verification code sent to email.
      </div>

      {/* HELPER TEXT - ERROR */}
      <div data-state="error" className="w-80 justify-start text-Colors-Text-text-error-primary-(600) text-sm font-medium font-['Figtree'] leading-5 hidden">
        Incorrect code. Please check your email and try again.
      </div>

      {/* HELPER TEXT - SUCCESS */}
      <div data-state="success" className="w-80 justify-start text-Color-Semantic-Colors-Success-2-500---Success-Light text-sm font-medium font-['Figtree'] leading-5 hidden">
        Email verified successfully! Your profile has been updated.
      </div>

    </div>
  </div>
</div>

{/* SIMULATION CODES REFERENCE:
   - Correct Code: 123456
   - Wrong Code Example: 654321
*/}
