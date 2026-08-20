with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# The end of the file currently is:
#                 </div>
#               </div>
#             )
#             )}
#           </div>
#         )}
#       </div>
#     </div>
#   );
# }

target = '''                </div>
              </div>
            )
            )}
          </div>
        )}
      </div>
    </div>
  );
}'''

replacement = '''                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}'''

content = content.replace(target, replacement)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
